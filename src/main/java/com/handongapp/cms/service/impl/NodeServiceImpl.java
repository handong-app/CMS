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
     * 주어진 fileListId를 기반으로, 노드의 data의 파일 메타데이터를 업데이트합니다.
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

        String originalFileName = fileList.getOriginalFileName();
        String contentType = fileList.getContentType();
        String fileKey = fileList.getFileKey();

        ObjectMapper objectMapper = new ObjectMapper();
        try {
            if (node.getType() == TbNode.NodeType.VIDEO) {
                VideoNodeData data = objectMapper.convertValue(node.getData(), VideoNodeData.class);
                if (data == null) {
                    data = new VideoNodeData();
                }
                VideoMetaData videoMetaData = new VideoMetaData();
                videoMetaData.setPath(fileKey);
                videoMetaData.setOriginalFileName(originalFileName);
                videoMetaData.setStatus(VideoStatus.UPLOADED);
                videoMetaData.setContentType(contentType);

                data.setFile(videoMetaData);
                node.setData(objectMapper.convertValue(data, new TypeReference<Map<String, Object>>() {}));
            } else {
                FileNodeData data = objectMapper.convertValue(node.getData(), FileNodeData.class);
                if (data == null) {
                    data = new FileNodeData();
                }
                FileMetaData fileMetaData = new FileMetaData();
                fileMetaData.setFileKey(fileKey);
                fileMetaData.setOriginalFileName(originalFileName);
                fileMetaData.setStatus(FileStatus.UPLOADED);
                fileMetaData.setContentType(contentType);

                data.setFile(fileMetaData);
                node.setData(objectMapper.convertValue(data, new TypeReference<Map<String, Object>>() {}));
            }

            nodeRepository.save(node);
            log.info("📦 TbNode data.file 업데이트 완료: {}", fileKey);
        } catch (Exception e) {
            log.error("❌ TbNode data.file 업데이트 실패: {}", e.getMessage(), e);
            throw new DataUpdateException("노드 data 업데이트 실패", e);
        }
    }
}
