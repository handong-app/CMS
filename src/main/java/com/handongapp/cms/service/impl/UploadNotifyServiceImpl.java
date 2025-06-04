package com.handongapp.cms.service.impl;

import com.handongapp.cms.domain.TbFileList;
import com.handongapp.cms.domain.TbNode;
import com.handongapp.cms.dto.v1.S3Dto;
import com.handongapp.cms.exception.file.UploadNotificationException;
import com.handongapp.cms.mapper.NodeMapper;
import com.handongapp.cms.repository.FileListRepository;
import com.handongapp.cms.service.UploadNotifyService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 파일 업로드 완료 후 처리 로직을 담당하는 서비스 구현체.
 * <p>
 * 주요 기능:
 * <ul>
 *     <li>파일의 소유권 검증 (fileKey가 해당 노드의 파일인지 검증)</li>
 *     <li>업로드 완료 상태를 DB에 반영</li>
 *     <li>기존의 다른 파일들은 S3 및 DB에서 삭제 (노드에는 하나의 파일만 존재하도록 보장)</li>
 *     <li>노드의 data.file 필드 업데이트</li>
 *     <li>노드가 비디오 타입일 경우 트랜스코딩 요청을 RabbitMQ로 전송</li>
 * </ul>
 * <p>
 * 실패나 예외 상황에서는 UploadNotificationException 혹은 IllegalArgumentException을 발생시킵니다.
 * </p>
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class UploadNotifyServiceImpl implements UploadNotifyService {

    private final AmqpTemplate amqpTemplate;
    private final S3Client s3Client;
    private final FileListRepository fileListRepository;
    private final NodeMapper nodeMapper;
    private final NodeServiceImpl nodeService;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    @Value("${rabbitmq.queue.transcode-request}")
    private String transcodeRequestQueue;


    /**
     * S3 업로드 완료 알림을 처리합니다.
     * <p>
     * - 파일이 해당 노드에 실제 속하는지 검증합니다.
     * - 업로드 완료 상태를 DB에 반영합니다.
     * - 같은 노드ID를 가지지만 fileListId는 제외한 다른 파일들을 S3 및 DB에서 삭제합니다.
     * - 노드의 data.file 정보를 업데이트합니다.
     * - 노드 타입이 비디오라면 트랜스코딩 요청을 전송합니다.
     *
     * @param dto 업로드 완료 요청 DTO
     */
    @Override
    @Transactional
    public void nodeFileUploadComplete(S3Dto.UploadCompleteRequest dto) {
        // fileKey가 해당 nodeId에 실제 속하는지 검증
        validateFileKeyBelongsToNode(dto.getFileListId(), dto.getId(), dto.getFileKey());

        markFileAsUploaded(dto);
        TbNode.NodeType nodeType = nodeMapper.findNodeTypeById(dto.getId());
        log.info("🔍 노드 타입 확인: {}", nodeType);

        // 같은 노드ID를 가지지만 fileListId는 제외한 다른 파일들을 삭제
        // 같은 확장자를 가졌다면, 이미 MinIO 에 upsert 되었으므로 이미 파일이 1개일 것임
        deleteOtherFilesByNodeIdExcept(dto.getId(), dto.getFileListId(), dto.getFileKey());

        nodeService.updateNodeFileData(dto.getId(), dto.getFileListId());

        log.info("📁 TbNode fileKey 업데이트 완료: {}", dto.getFileKey());

        if (nodeType == TbNode.NodeType.VIDEO) {
//            TODO: 트랜스코딩 기능 임시 비활성화 - 개발 완료 후 활성화 필요
            log.info("트랜스코딩 기능이 임시 비활성화되었습니다.");
//            triggerTranscode(
//                    S3Dto.TransCodeRequest.builder()
//                    .fileKey(dto.getFileKey())
//                    .filetype("video")
//                    .build()
//            );
        }
    }

    /**
     * 주어진 fileListId가 해당 nodeId 및 fileKey와 일치하는지 검증합니다.
     * <p>
     * 일치하지 않으면 IllegalArgumentException을 던집니다.
     *
     * @param fileListId 검증할 파일 리스트 ID
     * @param nodeId     노드 ID
     * @param fileKey    파일 키
     */
    private void validateFileKeyBelongsToNode(String fileListId, String nodeId, String fileKey) {
        fileListRepository.findById(fileListId)
                .filter(file -> file.getNodeId().equals(nodeId) && file.getFileKey().equals(fileKey))
                .orElseThrow(() -> new IllegalArgumentException("요청된 파일 정보가 유효하지 않습니다. fileListId=" + fileListId));
    }

    /**
     * 업로드 완료 상태를 DB에 반영합니다.
     * <p>
     * 주어진 fileListId의 파일을 조회하고, 업로드 완료로 상태를 변경합니다.
     *
     * @param dto 업로드 완료 요청 DTO
     */
    private void markFileAsUploaded(S3Dto.UploadCompleteRequest dto) {
        TbFileList fileList = fileListRepository.findById(dto.getFileListId())
                .orElseThrow(() -> new IllegalArgumentException("파일을 찾을 수 없습니다: " + dto.getFileListId()));

        fileList.setIsUploadComplete(true);
        fileList.setCompletedAt(LocalDateTime.now());
        fileListRepository.save(fileList);

        log.info("✅ 업로드 완료 처리됨: {}", fileList.getFileKey());
    }

    /**
     * 비디오 노드의 경우, 트랜스코딩 요청을 RabbitMQ로 전송합니다.
     * <p>
     * 전송 중 오류가 발생하면 UploadNotificationException을 던집니다.
     *
     * @param dto 업로드 완료 요청 DTO
     */
    private void triggerTranscode(S3Dto.TransCodeRequest dto) {
        try {
            amqpTemplate.convertAndSend(transcodeRequestQueue, dto);
            log.info("🚀 트랜스코딩 요청 전송 완료: {}", transcodeRequestQueue);
        } catch (Exception e) {
            log.error("❌ 트랜스코딩 요청 실패: {}", e.getMessage(), e);
            throw new UploadNotificationException(e);
        }
    }

    /**
     * 같은 노드ID를 가지지만 fileListId는 제외한 다른 파일들을 S3 및 DB에서 삭제합니다.
     *
     * @param nodeId         노드 ID
     * @param fileListIdToKeep 유지할 파일 리스트 ID
     */
    private void deleteOtherFilesByNodeIdExcept(String nodeId, String fileListIdToKeep, String fileKeyToKeep) {
        List<TbFileList> otherFiles = fileListRepository.findByNodeIdForUpdate(nodeId);
        for (TbFileList file : otherFiles) {
            if (!file.getId().equals(fileListIdToKeep)) {
                if(!file.getFileKey().equals(fileKeyToKeep))
                    deleteFileFromS3(file.getFileKey());
                fileListRepository.delete(file);
                log.info("🗑️ 같은 노드ID 다른 파일 삭제됨: {}", file.getFileKey());
            }
        }
    }


    /**
     * S3에서 주어진 파일 키에 해당하는 파일을 삭제합니다.
     * <p>
     * 삭제 중 오류가 발생하면 로그로 기록 후 예외를 던집니다.
     *
     * @param fileKey S3에서 삭제할 파일 키
     */
    private void deleteFileFromS3(String fileKey) {
        try {
            s3Client.deleteObject(DeleteObjectRequest.builder()
                    .bucket(bucket)
                    .key(fileKey)
                    .build());
            log.info("🗑️ S3에서 파일 삭제: {}", fileKey);
        } catch (Exception e) {
            log.error("❌ S3 파일 삭제 실패: {}", fileKey, e);
            throw new UploadNotificationException("S3 파일 삭제 실패: " + fileKey, e);
        }
    }
}