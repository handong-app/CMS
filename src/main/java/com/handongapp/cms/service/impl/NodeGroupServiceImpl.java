package com.handongapp.cms.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.handongapp.cms.domain.TbNodeGroup;
import com.handongapp.cms.dto.v1.NodeGroupDto;
import com.handongapp.cms.repository.NodeGroupRepository;
import com.handongapp.cms.service.NodeGroupService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import com.handongapp.cms.mapper.NodeGroupMapper;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
@RequiredArgsConstructor
public class NodeGroupServiceImpl implements NodeGroupService {

    private final NodeGroupMapper nodeGroupMapper;
    private final ObjectMapper objectMapper;
    private final NodeGroupRepository nodeGroupRepository;
    private final PresignedUrlServiceImpl presignedUrlService;

    @Override
    @Transactional
    public NodeGroupDto.Response create(NodeGroupDto.CreateRequest req) {
        TbNodeGroup entity = req.toEntity();
        TbNodeGroup savedNodeGroup = nodeGroupRepository.save(entity);
        return NodeGroupDto.Response.from(savedNodeGroup);
    }

    @Override
    @Transactional(readOnly = true)
    public NodeGroupDto.Response get(String id) {
        TbNodeGroup nodeGroup = nodeGroupRepository.findByIdAndDeleted(id, "N")
                .orElseThrow(() -> new EntityNotFoundException("NodeGroup not found with id: " + id));
        return NodeGroupDto.Response.from(nodeGroup);
    }

    @Override
    @Transactional(readOnly = true)
    public List<NodeGroupDto.Response> listBySection(String sectionId) {
        return nodeGroupRepository.findBySectionIdAndDeletedOrderByOrderAsc(sectionId, "N")
                .stream()
                .map(NodeGroupDto.Response::from)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public NodeGroupDto.Response update(String id, NodeGroupDto.UpdateRequest req) {
        TbNodeGroup entity = nodeGroupRepository.findByIdAndDeleted(id, "N")
                .orElseThrow(() -> new EntityNotFoundException("NodeGroup not found with id: " + id));
        req.applyTo(entity);
        return NodeGroupDto.Response.from(entity);
    }

    @Override
    @Transactional
    public void deleteSoft(String id) {
        TbNodeGroup entity = nodeGroupRepository.findByIdAndDeleted(id, "N")
                .orElseThrow(() -> new EntityNotFoundException("NodeGroup not found with id: " + id));
        entity.setDeleted("Y");
    }

    @Override
    @Transactional(readOnly = true)
    public String fetchAllInfo(String nodeGroupId) {
        if (nodeGroupId == null || nodeGroupId.trim().isEmpty()) {
            throw new IllegalArgumentException("NodeGroupId cannot be null or empty.");
        }
        nodeGroupRepository.findByIdAndDeleted(nodeGroupId, "N")
                .orElseThrow(() -> new EntityNotFoundException("NodeGroup not found with id: " + nodeGroupId + " or it has been deleted."));

        String rawJson = nodeGroupMapper.fetchAllInfoByNodeGroupId(nodeGroupId);

        try {
            JsonNode root = objectMapper.readTree(rawJson);
            JsonNode nodes = root.get("nodes");
            if (nodes != null && nodes.isArray()) {
                for (JsonNode node : nodes) {
                    String type = node.get("type").asText();
                    if ("IMAGE".equals(type) || "FILE".equals(type)) {
                        JsonNode fileNode = node.get("data").get("file");
                        if (fileNode != null
                                && fileNode.has("fileKey")
                                && fileNode.has("status")
                                && "UPLOADED".equals(fileNode.get("status").asText())) {

                            String fileKey = fileNode.get("fileKey").asText();

                            // presigned URL 생성
                            String presignedUrl = presignedUrlService.generateDownloadUrl(fileKey).toString();

                            // "fileKey" 제거하고 "presignedUrl" 추가
                            ((ObjectNode) fileNode).remove("fileKey");
                            ((ObjectNode) fileNode).put("presignedUrl", presignedUrl);
                        }
                    }
                }
            }
            return objectMapper.writeValueAsString(root);
        } catch (Exception e) {
            throw new IllegalStateException("NodeGroup JSON 파싱/직렬화에 실패했습니다.", e);
        }
    }
}
