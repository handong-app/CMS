package com.handongapp.cms.service.impl;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.handongapp.cms.domain.TbFileList;
import com.handongapp.cms.domain.TbNode;
import com.handongapp.cms.domain.enums.FileStatus;
import com.handongapp.cms.domain.enums.VideoStatus;
import com.handongapp.cms.domain.model.FileMetaData;
import com.handongapp.cms.domain.model.FileNodeData;
import com.handongapp.cms.domain.model.VideoMetaData;
import com.handongapp.cms.domain.model.VideoNodeData;
import com.handongapp.cms.dto.v1.NodeDto;
import com.handongapp.cms.exception.data.DataUpdateException;
import com.handongapp.cms.exception.data.NotFoundException;
import com.handongapp.cms.repository.FileListRepository;
import com.handongapp.cms.repository.NodeRepository;
import com.handongapp.cms.service.NodeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityNotFoundException;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@Slf4j
@Service
@RequiredArgsConstructor
public class NodeServiceImpl implements NodeService {

    // ObjectMapper는 스레드 안전하므로 싱글턴으로 재사용하는 것이 성능 & 메모리 사용량 개선에 도움이 됨.
    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    private final NodeRepository nodeRepository;
    private final FileListRepository fileListRepository;

    @Override
    @Transactional
    public NodeDto.Response create(NodeDto.CreateRequest req) {
//        NodeDataValidator.validate(req.getType(), req.getData());
        TbNode entity = req.toEntity(); 
        TbNode savedNode = nodeRepository.save(entity);
        return NodeDto.Response.from(savedNode); 
    }

    @Override
    @Transactional(readOnly = true)
    public NodeDto.Response get(String nodeId) {
        TbNode node = nodeRepository.findByIdAndDeleted(nodeId, "N")
                .orElseThrow(() -> new EntityNotFoundException("Node not found with id: " + nodeId));
        return NodeDto.Response.from(node); 
    }

    @Override
    @Transactional(readOnly = true)
    public List<NodeDto.Response> listByGroup(String nodeGroupId) {
        return nodeRepository.findByNodeGroupIdAndDeletedOrderByOrderAsc(nodeGroupId, "N")
                .stream()
                .map(NodeDto.Response::from) 
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public NodeDto.Response update(String nodeId, NodeDto.UpdateRequest req) {
        TbNode entity = nodeRepository.findByIdAndDeleted(nodeId, "N")
                .orElseThrow(() -> new EntityNotFoundException("Node not found with id: " + nodeId));
        if (req.getData() != null) {
//            NodeDataValidator.validate(entity.getType(), req.getData());
        }
        req.applyTo(entity); 
        return NodeDto.Response.from(entity); 
    }

    @Override
    @Transactional
    public void deleteSoft(String nodeId) {
        TbNode entity = nodeRepository.findByIdAndDeleted(nodeId, "N")
                .orElseThrow(() -> new EntityNotFoundException("Node not found with id: " + nodeId));
        entity.setDeleted("Y");
    }

    /**
     * 주어진 fileListId를 기반으로, 노드의 data의 파일 메타데이터를 업로드 중 상태로 업데이트합니다.
     * <p>
     * 이 메서드는 다음과 같은 과정을 수행합니다:
     * <ul>
     *   <li>주어진 nodeId로 {@link TbNode}를 조회합니다.</li>
     *   <li>주어진 fileListId로 {@link TbFileList}를 조회합니다.</li>
     *   <li>노드 타입에 따라 (VIDEO 또는 IMAGE/FILE), 해당 파일 메타데이터를 업데이트합니다.</li>
     *   <li>{@link ObjectMapper}를 사용해 data를 JSON으로 변환 및 역직렬화합니다.</li>
     *   <li>파일 상태를 {@link FileStatus#UPLOADING}로 설정합니다.</li>
     *   <li>업데이트된 노드를 저장소에 저장합니다.</li>
     * </ul>
     * <p>
     * 변환 또는 업데이트 중 오류가 발생하면 {@link DataUpdateException}을 발생시킵니다.
     *
     * @param nodeId     업데이트할 노드의 ID
     * @param fileListId 노드와 연관된 파일의 ID
     */
    @Override
    @Transactional
    public void updateNodeFileDataToUploading(String nodeId, String fileListId) {
        TbNode node = nodeRepository.findById(nodeId)
                .orElseThrow(() -> new NotFoundException("노드를 찾을 수 없습니다: " + nodeId));

        TbFileList fileList = fileListRepository.findById(fileListId)
                .orElseThrow(() -> new NotFoundException("파일 정보를 찾을 수 없습니다: " + fileListId));

        updateNodeFileDataInternal(node, fileList, FileStatus.UPLOADING, VideoStatus.UPLOADING);
        log.info("📦 TbNode data.file.status를 UPLOADING으로 업데이트 완료: {}", fileList.getFileKey());
    }

    /**
     * 주어진 fileListId를 기반으로, 노드의 data의 파일 메타데이터를 업로드 완료 상태로 업데이트합니다.
     * <p>
     * 이 메서드는 다음과 같은 과정을 수행합니다:
     * <ul>
     *   <li>주어진 nodeId로 {@link TbNode}를 조회합니다.</li>
     *   <li>주어진 fileListId로 {@link TbFileList}를 조회합니다.</li>
     *   <li>노드 타입에 따라 (VIDEO 또는 IMAGE/FILE), 해당 파일 메타데이터를 업데이트합니다.</li>
     *   <li>{@link ObjectMapper}를 사용해 data를 JSON으로 변환 및 역직렬화합니다.</li>
     *   <li>파일 상태를 {@link FileStatus#UPLOADED}로 설정합니다.</li>
     *   <li>업데이트된 노드를 저장소에 저장합니다.</li>
     * </ul>
     * <p>
     * 변환 또는 업데이트 중 오류가 발생하면 {@link DataUpdateException}을 발생시킵니다.
     *
     * @param nodeId     업데이트할 노드의 ID
     * @param fileListId 노드와 연관된 파일의 ID
     */
    @Transactional
    public void updateNodeFileData(String nodeId, String fileListId) {
        TbNode node = nodeRepository.findById(nodeId)
                .orElseThrow(() -> new NotFoundException("노드를 찾을 수 없습니다: " + nodeId));

        TbFileList fileList = fileListRepository.findById(fileListId)
                .orElseThrow(() -> new NotFoundException("파일 정보를 찾을 수 없습니다: " + fileListId));

        updateNodeFileDataInternal(node, fileList, FileStatus.UPLOADED, VideoStatus.UPLOADED);
        log.info("📦 TbNode data.file 업데이트 완료: {}", fileList.getFileKey());
    }

    /**
     * 주어진 {@link TbNode}와 {@link TbFileList}를 기반으로, 노드의 data의 파일 메타데이터를 업데이트합니다.
     *
     * @param node           업데이트할 노드
     * @param fileList       노드에 연관된 파일 정보
     * @param fileStatus     파일 상태 (IMAGE/FILE)
     * @param videoStatus    비디오 상태 (VIDEO)
     */
    private void updateNodeFileDataInternal(TbNode node, TbFileList fileList, FileStatus fileStatus, VideoStatus videoStatus) {
        String originalFileName = fileList.getOriginalFileName();
        String contentType = fileList.getContentType();
        String fileKey = fileList.getFileKey();

        try {
            if (node.getType() == TbNode.NodeType.VIDEO) {
                VideoNodeData data = OBJECT_MAPPER.convertValue(node.getData(), VideoNodeData.class);
                if (data == null) data = new VideoNodeData();

                VideoMetaData videoMetaData = new VideoMetaData();
                videoMetaData.setPath(fileKey);
                videoMetaData.setOriginalFileName(originalFileName);
                videoMetaData.setStatus(videoStatus);
                videoMetaData.setContentType(contentType);

                data.setFile(videoMetaData);
                node.setData(OBJECT_MAPPER.convertValue(data, new TypeReference<Map<String, Object>>() {}));
            } else {
                FileNodeData data = OBJECT_MAPPER.convertValue(node.getData(), FileNodeData.class);
                if (data == null) data = new FileNodeData();

                FileMetaData fileMetaData = new FileMetaData();
                fileMetaData.setFileKey(fileKey);
                fileMetaData.setOriginalFileName(originalFileName);
                fileMetaData.setStatus(fileStatus);
                fileMetaData.setContentType(contentType);

                data.setFile(fileMetaData);
                node.setData(OBJECT_MAPPER.convertValue(data, new TypeReference<Map<String, Object>>() {}));
            }

            nodeRepository.save(node);
        } catch (Exception e) {
            log.error("❌ TbNode data.file 업데이트 실패: {}", e.getMessage(), e);
            throw new DataUpdateException("노드 data 업데이트 실패", e);
        }
    }

    /**
     * 비디오 트랜스코딩 상태 및 진행률을 업데이트합니다.
     *
     * <p>
     * 전달받은 videoId를 가진 노드를 찾아 {@code data.file.status}와
     * {@code data.file.progress}를 업데이트합니다.
     * </p>
     *
     * @param videoId  노드 ID (UUID와 동일)
     * @param status   트랜스코딩 상태 (예: in_progress, success, failed)
     * @param progress 트랜스코딩 진행률 (0~100), 없으면 null
     */
    @Override
    @Transactional
    public void updateVideoTranscodeStatus(String videoId, String status, Integer progress) {
        // 1. 노드 조회
        TbNode node = nodeRepository.findById(videoId)
                .orElseThrow(() -> new NotFoundException("노드를 찾을 수 없습니다: " + videoId));

        // 2. data JSON에서 file Map 꺼내기
        Map<String, Object> dataMap = node.getData();
        if (dataMap == null) {
            throw new IllegalStateException("노드 data가 존재하지 않습니다. videoId=" + videoId);
        }

        Object fileObj = dataMap.get("file");
        if (!(fileObj instanceof Map<?, ?>)) {
            throw new IllegalStateException("노드 data의 file 정보가 없습니다. videoId=" + videoId);
        }

        @SuppressWarnings("unchecked")
        Map<String, Object> fileMap = (Map<String, Object>) fileObj;

        // 3. 새로운 status로 변환
        String newStatus;
        switch (status) {
            case "in_progress" -> newStatus = VideoStatus.TRANSCODING.name();
            case "success" -> newStatus = VideoStatus.TRANSCODE_COMPLETED.name();
            case "failed" -> newStatus = VideoStatus.TRANSCODE_FAILED.name();
            default -> throw new IllegalArgumentException("알 수 없는 status: " + status);
        }

        // 4. 업데이트
        fileMap.put("status", newStatus);
        fileMap.put("progress", progress);

        log.info("🎥 videoId={} 트랜스코딩 상태={}, 진행률={}", videoId, newStatus, progress);

        // 5. 저장
        nodeRepository.save(node);
    }
}
