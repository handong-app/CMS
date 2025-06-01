package com.handongapp.cms.service.impl;

import com.handongapp.cms.domain.TbClubRole;
import com.handongapp.cms.domain.TbFileList;
import com.handongapp.cms.domain.TbNode;
import com.handongapp.cms.domain.TbUserClubRole;
import com.handongapp.cms.domain.enums.ClubUserRole;
import com.handongapp.cms.dto.v1.S3Dto;
import com.handongapp.cms.exception.file.PresignedUrlCreationException;
import com.handongapp.cms.mapper.NodeMapper;
import com.handongapp.cms.repository.ClubRoleRepository;
import com.handongapp.cms.repository.FileListRepository;
import com.handongapp.cms.repository.UserClubRoleRepository;
import com.handongapp.cms.service.PresignedUrlService;
import com.handongapp.cms.util.FileUtil;
import jakarta.annotation.PreDestroy;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

import java.net.URL;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.regex.Pattern;

@Slf4j
@Service
@RequiredArgsConstructor
public class PresignedUrlServiceImpl implements PresignedUrlService {

    private final S3Presigner presigner;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    @Value("${cloud.aws.s3.presigned-url-duration}")
    private Duration signatureDuration;

    private final NodeMapper nodeMapper;
    private final UserClubRoleRepository userClubRoleRepository;
    private final ClubRoleRepository clubRoleRepository;
    private final FileListRepository fileListRepository;

    @Override
    public S3Dto.UploadUrlResponse generateNodeFileUploadUrl(S3Dto.NodeFileUploadUrlRequest request, String userId) {
        String clubId = nodeMapper.findClubIdByNodeId(request.getNodeId());
        String originalFilename = request.getFilename();
        String extension = FilenameUtils.getExtension(originalFilename);
        String mimeType = FileUtil.detectMimeTypeByFilename(originalFilename);

        if (clubId == null) {
            throw new IllegalArgumentException("해당 노드의 소속 클럽을 찾을 수 없습니다. 노드 ID: " + request.getNodeId());
        }

        if (!hasUploadPermission(userId, clubId)) {
            throw new AccessDeniedException("해당 클럽에 대한 파일 업로드 권한이 없습니다.");
        }

        if (!isContentTypeValid(request.getNodeId(), mimeType)) {
            throw new IllegalArgumentException("해당 노드에 허용되지 않는 파일 확장자입니다." + request.getFilename());
        }

        TbNode.NodeType nodeType = nodeMapper.findNodeTypeById(request.getNodeId());
        String subfolder = switch (nodeType) {
            case IMAGE -> "image/";
            case VIDEO -> "video/";
            case FILE -> "file/";
            default -> throw new IllegalArgumentException("허용되지 않는 노드 타입입니다: " + nodeType);
        };

        String path = "node_file/"+subfolder;

        S3Dto.UploadUrlResponse response = generateUploadUrl(path, request.getNodeId(), originalFilename, extension, mimeType);

        TbFileList savedFileList = fileListRepository.save(
                TbFileList.builder()
                        .userId(userId)
                        .clubId(clubId)
                        .nodeId(request.getNodeId())
                        .fileKey(response.getFileKey())
                        .originalFileName(originalFilename)
                        .contentType(mimeType)
                        .isUploadComplete(false)
                        .requestedAt(LocalDateTime.now())
                        .build()
        );

        response.setFileListId(savedFileList.getId());

        return response;
    }

    public S3Dto.UploadUrlResponse generateUploadUrl(String path, String id, String originalFilename, String extension, String contentType) {
        validateInput(originalFilename, "파일명");
        validateInput(contentType, "콘텐츠 타입");

        // 파일명 보안 검증
        if (!isValidFilename(originalFilename)) {
            throw new IllegalArgumentException("유효하지 않은 파일명입니다: " + originalFilename);
        }

        try {
            String fileKey = path + id + "." + extension;
            PutObjectRequest objectRequest = PutObjectRequest.builder()
                    .bucket(bucket)
                    .key(fileKey)
                    .contentType(contentType)
                    .build();

            PutObjectPresignRequest presignRequest = PutObjectPresignRequest.builder()
                    .signatureDuration(signatureDuration)
                    .putObjectRequest(objectRequest)
                    .build();

            return S3Dto.UploadUrlResponse.builder()
                    .presignedUrl(presigner.presignPutObject(presignRequest).url().toString())
                    .fileKey(fileKey)
                    .originalFilename(originalFilename)
                    .build();
        } catch (Exception e) {
            log.error("Presigned URL 생성 실패: filename={}, contentType={}", originalFilename, contentType, e);
            throw new PresignedUrlCreationException("Upload Presigned URL 생성 중 오류가 발생했습니다", e);
        }
    }

    public URL generateDownloadUrl(String key) {
        if (!StringUtils.hasText(key)) {
            throw new IllegalArgumentException("파일 키는 필수입니다");
        }

        try {
            GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                    .bucket(bucket)
                    .key(key)
                    .build();
            GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                    .signatureDuration(signatureDuration)
                    .getObjectRequest(getObjectRequest)
                    .build();
            return presigner.presignGetObject(presignRequest).url();
        } catch (Exception e) {
            throw new PresignedUrlCreationException("Download Presigned URL 생성 중 오류가 발생했습니다: " + e.getMessage(), e);
        }
    }

    private void validateInput(String input, String fieldName) {
        if (!StringUtils.hasText(input)) {
            throw new IllegalArgumentException(fieldName + "은(는) 필수입니다");
        }
    }
    private boolean isValidFilename(String filename) {
        // 경로 순회 공격 방지 및 특수문자 제한
        Pattern pattern = Pattern.compile("^[a-zA-Z0-9._-]+$");
        return !filename.contains("..")
                && !filename.startsWith("/")
                && pattern.matcher(filename).matches()
                && filename.length() <= 255;
    }

    @PreDestroy
    public void destroy() {
        if (presigner != null) {
            presigner.close();
        }
    }

    public boolean hasUploadPermission(String userId, String clubId) {
        TbUserClubRole userClubRole = userClubRoleRepository.findByUserIdAndClubIdAndDeleted(userId, clubId, "N")
                .orElseThrow(() -> new AccessDeniedException("권한 정보가 없습니다."));
        TbClubRole clubRole = clubRoleRepository.findById(userClubRole.getRoleId())
                .orElseThrow(() -> new AccessDeniedException("역할 정보가 없습니다."));

        if (clubRole.getType() == null) {
            return false;
        }

        // TODO: 업로드 가능 권한 추가시 || 로 해당 권한도 true 를 반환하도록 해야 함.
        return ClubUserRole.CLUB_SUPER_ADMIN.equals(clubRole.getType());
    }


    public boolean isContentTypeValid(String nodeId, String mimeType) {
        TbNode.NodeType nodeType = nodeMapper.findNodeTypeById(nodeId);

        if (nodeType == null) {
            return false;
        }

        // 이 스위치 표현식은 Java 12+ 에서 지원합니다.
        return switch (nodeType) {
            case IMAGE -> mimeType != null && mimeType.startsWith("image/");
            case VIDEO -> mimeType != null && mimeType.startsWith("video/");
            case FILE -> true;  // FILE 타입에서는 모든 mimeType 허용
            default ->  false;  // TEXT, QUIZ 등은 업로드 허용하지 않음
        };
    }
}
