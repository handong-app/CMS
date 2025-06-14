package app.handong.cms.service.impl;

import app.handong.cms.domain.*;
import app.handong.cms.repository.*;
import app.handong.cms.service.NodeService;
import app.handong.cms.service.PresignedUrlService;
import app.handong.cms.domain.enums.ClubUserRole;
import app.handong.cms.domain.enums.FileStatus;
import app.handong.cms.dto.v1.S3Dto;
import app.handong.cms.exception.data.NotFoundException;
import app.handong.cms.exception.file.PresignedUrlCreationException;
import app.handong.cms.mapper.NodeMapper;
import app.handong.cms.repository.*;
import app.handong.cms.service.*;
import app.handong.cms.util.FileUtil;
import jakarta.annotation.PreDestroy;
import jakarta.transaction.Transactional;
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
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.regex.Pattern;


/**
 * S3 Presigned URL 서비스 구현체.
 * <p>
 * 파일 업로드 및 다운로드를 위한 Presigned URL을 생성하며, 노드와 사용자 권한 검증, 파일 검증 로직을 포함합니다.
 * </p>
 *
 * 주요 기능:
 * <ul>
 *     <li>노드 파일 업로드 Presigned URL 생성</li>
 *     <li>파일 다운로드 Presigned URL 생성 (기본/커스텀 만료시간)</li>
 *     <li>파일명 및 MIME 타입 유효성 검사</li>
 *     <li>사용자 업로드 권한 확인</li>
 * </ul>
 *
 * <p>노드 서비스 및 S3 Presigner를 통해 S3와 연동합니다.</p>
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class PresignedUrlServiceImpl implements PresignedUrlService {

    private final S3Presigner presigner;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    @Value("${cloud.aws.s3.presigned-url-duration}")
    private Duration signatureDuration;

    private static final Pattern SAFE_FILENAME_PATTERN = Pattern.compile("^[\\p{L}\\p{N}._!()-\\- ]+$");

    private final NodeMapper nodeMapper;
    private final UserClubRoleRepository userClubRoleRepository;
    private final ClubRepository clubRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;

    private final ClubRoleRepository clubRoleRepository;
    private final FileListRepository fileListRepository;
    private final NodeService nodeService;


    /**
     * S3 업로드 Presigned URL을 생성하고, 관련 TbFileList를 저장한 뒤 응답 DTO를 반환합니다.
     *
     * @param request 업로드 요청 정보 (노드 ID, 파일명 등)
     * @param userId  업로드를 수행하는 사용자 ID
     * @return Presigned URL, 파일 키, 파일 리스트 ID 등이 담긴 응답 DTO
     */
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

        nodeService.updateNodeFileDataToUploading(request.getNodeId(), savedFileList.getId());

        response.setFileListId(savedFileList.getId());

        return response;
    }

    /**
     * 대상별(코스, 클럽, 사용자) Presigned Upload URL을 생성합니다.
     * <p>
     * 업로드 대상의 타입({@code targetType})에 따라 S3 경로 및 {@code fileKey}를 생성하며,
     * {@link TbFileList} 엔티티를 생성 및 저장합니다.
     * <p>
     * 업로드 URL 생성 후, 각 대상 테이블(course/club/user)의 {@code fileKey}도 함께 업데이트됩니다.
     *
     * @param targetType      업로드 대상의 타입 (예: {@code course-banner}, {@code club-banner}, {@code user-profile})
     * @param targetId        업로드 대상의 ID (코스 ID, 클럽 ID, 사용자 ID)
     * @param originalFilename 원본 파일명
     * @param userId          업로더의 사용자 ID
     * @return Presigned Upload URL 및 파일 정보 DTO
     * @throws IllegalArgumentException         지원하지 않는 {@code targetType}일 경우 발생
     * @throws PresignedUrlCreationException    Presigned URL 생성 또는 DB 처리 중 오류가 발생할 경우 발생
     */
    @Override
    @Transactional
    public S3Dto.UploadUrlResponse generateBannerUploadUrl(String targetType, String targetId, String originalFilename, String userId) {
        String path;
        switch (targetType) {
            case "course-banner" -> path = "course-banner/";
            case "club-banner" -> path = "club-banner/";
            case "user-profile" -> path = "user-profile/";
            default -> throw new IllegalArgumentException("Unsupported targetType: " + targetType);
        }

        String extension = FilenameUtils.getExtension(originalFilename);
        String mimeType = FileUtil.detectMimeTypeByFilename(originalFilename);
        String fileKey = path + targetId + "." + extension;

        try {
            PutObjectRequest objectRequest = PutObjectRequest.builder()
                    .bucket(bucket)
                    .key(fileKey)
                    .contentType(mimeType)
                    .build();

            PutObjectPresignRequest presignRequest = PutObjectPresignRequest.builder()
                    .signatureDuration(signatureDuration)
                    .putObjectRequest(objectRequest)
                    .build();

            TbFileList.TbFileListBuilder fileListBuilder = TbFileList.builder()
                    .userId(userId)
                    .fileKey(fileKey)
                    .originalFileName(originalFilename)
                    .contentType(mimeType)
                    .isUploadComplete(false)
                    .requestedAt(LocalDateTime.now());

            switch (targetType) {
                case "course-banner" -> fileListBuilder.courseId(targetId);
                case "club-banner" -> fileListBuilder.clubId(targetId);
            }
            TbFileList savedFileList = fileListRepository.save(fileListBuilder.build());

            switch (targetType) {
                case "course-banner" -> updateCourseBanner(targetId, fileKey);
                case "club-banner" -> updateClubBanner(targetId, fileKey);
                case "user-profile" -> updateUserProfile(targetId, fileKey);
            }

            return S3Dto.UploadUrlResponse.builder()
                    .presignedUrl(presigner.presignPutObject(presignRequest).url().toString())
                    .fileKey(fileKey)
                    .originalFilename(originalFilename)
                    .fileListId(savedFileList.getId())
                    .build();

        } catch (Exception e) {
            throw new PresignedUrlCreationException("Presigned URL 생성 실패: " + e.getMessage(), e);
        }
    }

    /**
     * 파일 업로드용 Presigned URL을 생성합니다.
     *
     * @param path             S3 경로 (예: node_file/image/)
     * @param id               파일과 연결된 노드 ID
     * @param originalFilename 원본 파일명
     * @param extension        파일 확장자
     * @param contentType      MIME 타입
     * @return Presigned URL 응답 DTO
     */
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

    /**
     * 파일 다운로드 Presigned URL을 생성합니다. 사용자 정의 만료시간을 지정할 수 있습니다.
     *
     * @param key      S3 파일 키
     * @param duration Presigned URL 유효시간 (null인 경우 기본값 사용)
     * @return Presigned URL
     * @throws PresignedUrlCreationException 생성 실패 시 예외
     */
    public URL generateDownloadUrl(String key, Duration duration) {
        try {
            if (!StringUtils.hasText(key)) {
                throw new IllegalArgumentException("파일 키는 필수입니다");
            }

            Duration effectiveDuration = (duration != null) ? duration : signatureDuration;

            GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                    .bucket(bucket)
                    .key(key)
                    .build();
            GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                    .signatureDuration(effectiveDuration)
                    .getObjectRequest(getObjectRequest)
                    .build();
            return presigner.presignGetObject(presignRequest).url();
        } catch (Exception e) {
            throw new PresignedUrlCreationException("Download Presigned URL 생성 중 오류가 발생했습니다: " + e.getMessage(), e);
        }
    }
    /**
     * S3 Presigned URL을 생성하여 파일을 다운로드할 수 있는 링크를 반환합니다.
     * <p>
     * 이 메소드는 주어진 S3 key와 원본 파일명을 기반으로, presigned URL을 생성합니다.
     * 다운로드 시 브라우저에서 파일 이름을 {@code originalFileName}으로 표시할 수 있도록
     * {@code Content-Disposition: attachment} 헤더를 RFC 6266/5987 방식으로 설정합니다.
     * <p>
     * 만약 {@code duration}이 null로 주어지면, 기본 서명 만료 시간 {@code signatureDuration}을 사용합니다.
     *
     * @param key              다운로드할 S3 객체의 키 (필수, 비어있거나 null일 수 없음)
     * @param originalFileName 사용자에게 표시될 원본 파일 이름 (필수)
     * @param duration         Presigned URL 유효 기간 (null이면 기본값 사용)
     * @return presigned URL
     * @throws IllegalArgumentException        {@code key}나 {@code originalFileName}이 비어있거나 유효하지 않을 경우 발생합니다.
     * @throws PresignedUrlCreationException S3 Presigned URL 생성 중 오류가 발생할 경우 발생합니다.
     */
    @Override
    public URL generateDownloadUrlWithOriginalFileName(String key, String originalFileName, Duration duration) {
        try {

            if (!StringUtils.hasText(key)) {
                throw new IllegalArgumentException("파일 키는 필수입니다");
            }
            if (!StringUtils.hasText(originalFileName)) {
                throw new IllegalArgumentException("원본 파일명은 필수입니다");
            }
            if (!isValidFilename(originalFileName)) {
                throw new IllegalArgumentException("유효하지 않은 원본 파일명입니다: " + originalFileName);
            }

            Duration effectiveDuration = (duration != null) ? duration : signatureDuration;

            // 위험 문자 제거 (줄바꿈, 따옴표 등)
            String sanitizedFileName = originalFileName.replaceAll("[\r\n\"]", "_");

            String contentDisposition;
            // ASCII로 표현 가능한지 여부 확인
            if (!StandardCharsets.US_ASCII.newEncoder().canEncode(originalFileName)) {
                // UTF-8로 URL 인코딩된 파일명 (RFC 5987)
                String utf8FileName = URLEncoder.encode(originalFileName, StandardCharsets.UTF_8);
                contentDisposition = "attachment; filename=\"" + sanitizedFileName + "\"; filename*=UTF-8''" + utf8FileName;
            } else {
                contentDisposition = "attachment; filename=\"" + sanitizedFileName + "\"";
            }

            GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                    .bucket(bucket)
                    .key(key)
                    .responseContentDisposition(contentDisposition)
                    .build();

            GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                    .signatureDuration(effectiveDuration)
                    .getObjectRequest(getObjectRequest)
                    .build();

            return presigner.presignGetObject(presignRequest).url();
        } catch (Exception e) {
            throw new PresignedUrlCreationException("Download Presigned URL 생성 중 오류가 발생했습니다: " + e.getMessage(), e);
        }
    }

    /**
     * 입력값의 유효성을 검증합니다.
     *
     * @param input     입력 문자열
     * @param fieldName 필드명 (에러 메시지에 사용됨)
     * @throws IllegalArgumentException 입력값이 비어있거나 null일 때
     */
    private void validateInput(String input, String fieldName) {
        if (!StringUtils.hasText(input)) {
            throw new IllegalArgumentException(fieldName + "은(는) 필수입니다");
        }
    }

    /**
     * 파일명 보안 검증.
     * <p>
     * - 허용된 문자: 한글, 영문, 숫자, 밑줄(_), 하이픈(-), 점(.), 공백
     * - 경로 순회 방지: '..', '/'로 시작하는지 확인
     * - 최대 길이: 255자 이하
     * </p>
     *
     * @param filename 검증할 파일명
     * @return 유효하면 true, 아니면 false
     */
    private boolean isValidFilename(String filename) {
        return StringUtils.hasText(filename)
                && !filename.contains("..")
                && !filename.startsWith("/")
                && SAFE_FILENAME_PATTERN.matcher(filename).matches()
                && filename.length() <= 255;
    }

    /**
     * Presigner 종료 메서드.
     * <p>애플리케이션 종료 시 S3Presigner를 안전하게 닫습니다.</p>
     */
    @PreDestroy
    public void destroy() {
        if (presigner != null) {
            presigner.close();
        }
    }

    /**
     * 사용자가 클럽의 파일 업로드 권한을 가지는지 확인합니다.
     *
     * @param userId 사용자 ID
     * @param clubId 클럽 ID
     * @return 권한 여부
     */
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

    /**
     * 특정 노드 타입에 대해 파일의 MIME 타입이 허용되는지 확인합니다.
     *
     * @param nodeId   노드 ID
     * @param mimeType MIME 타입
     * @return 허용 여부
     */
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

    private void updateUserProfile(String userId, String fileKey) {
        TbUser user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found with id: " + userId));
        user.setFileKey(fileKey);
        user.setFileStatus(FileStatus.UPLOADING);
        userRepository.save(user);
    }

    private void updateClubBanner(String clubId, String fileKey) {
        TbClub club = clubRepository.findById(clubId)
                .orElseThrow(() -> new NotFoundException("Club not found with id: " + clubId));
        club.setFileKey(fileKey);
        club.setFileStatus(FileStatus.UPLOADING);
        clubRepository.save(club);
    }

    private void updateCourseBanner(String courseId, String fileKey) {
        TbCourse course = courseRepository.findById(courseId)
                .orElseThrow(() -> new NotFoundException("Course not found with id: " + courseId));
        course.setFileKey(fileKey);
        course.setFileStatus(FileStatus.UPLOADING);
        courseRepository.save(course);
    }
}
