package com.handongapp.cms.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.handongapp.cms.domain.TbNodeGroup;
import com.handongapp.cms.domain.TbSection;
import com.handongapp.cms.dto.v1.NodeGroupDto;
import com.handongapp.cms.repository.NodeGroupRepository;
import com.handongapp.cms.repository.SectionRepository;
import com.handongapp.cms.service.NodeGroupService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import com.handongapp.cms.mapper.NodeGroupMapper;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
@RequiredArgsConstructor
public class NodeGroupServiceImpl implements NodeGroupService {

    private final NodeGroupMapper nodeGroupMapper;
    private final ObjectMapper objectMapper;
    private final NodeGroupRepository nodeGroupRepository;
    private final SectionRepository sectionRepository;
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
                    JsonNode typeNode = node.get("type");
                    if (typeNode == null) continue;
                    String type = typeNode.asText();
                    if ("IMAGE".equals(type) || "FILE".equals(type)) {
                        JsonNode dataNode = node.get("data");
                        if (dataNode == null) continue;
                        JsonNode fileNode = dataNode.get("file");
                        if (fileNode != null){
                            if (fileNode.has("fileKey")
                                    && fileNode.has("status")
                                    && "UPLOADED".equals(fileNode.get("status").asText())) {
                                String fileKey = fileNode.get("fileKey").asText();
                                String presignedUrl = presignedUrlService.generateDownloadUrl(fileKey, Duration.ofHours(24)).toString();
                                ((ObjectNode) fileNode).put("presignedUrl", presignedUrl);
                            }
                            ((ObjectNode) fileNode).remove("fileKey");
                        }
                    }
                    else if ("VIDEO".equals(type)) {
                        JsonNode dataNode = node.get("data");
                        if (dataNode == null) continue;
                        JsonNode fileNode = dataNode.get("file");
                        if (fileNode != null){
                            if (fileNode.has("path")
                                    && fileNode.has("status")
                                    && "TRANSCODE_COMPLETED".equals(fileNode.get("status").asText())) {
                                String masterM3u8Endpoint = "/api/v1/stream/" + node.get("id").asText() + "/master.m3u8";
                                ((ObjectNode) fileNode).put("playlist", masterM3u8Endpoint);
                            }
                            ((ObjectNode) fileNode).remove("path");
                        }
                    }
                }
            }
            return objectMapper.writeValueAsString(root);
        } catch (Exception e) {
            throw new IllegalStateException("NodeGroup JSON 파싱/직렬화에 실패했습니다.", e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<NodeGroupDto.NextNodeGroupResponseDto> getNextNodeGroupInSectionOrCourse(String currentNodeGroupId) {
        TbNodeGroup currentNodeGroup = nodeGroupRepository.findByIdAndDeleted(currentNodeGroupId, "N")
                .orElseThrow(() -> new EntityNotFoundException("NodeGroup not found with id: " + currentNodeGroupId));

        // 1. Try to find next node group in the same section
        Optional<TbNodeGroup> nextNodeGroupOpt = nodeGroupRepository.findNextInSameSection(currentNodeGroup.getSectionId(), currentNodeGroup.getOrder().intValue());

        if (nextNodeGroupOpt.isPresent()) {
            TbNodeGroup nextNodeGroup = nextNodeGroupOpt.get();
            TbSection currentSection = sectionRepository.findByIdAndDeleted(currentNodeGroup.getSectionId(), "N")
                    .orElseThrow(() -> new EntityNotFoundException("Section not found for current node group's section: " + currentNodeGroup.getSectionId()));
            return Optional.of(NodeGroupDto.NextNodeGroupResponseDto.buildResponseDto(currentSection, nextNodeGroup));
        }

        // 2. If not found, try to find the first node group in the next section of the same course
        TbSection currentSectionForNextSearch = sectionRepository.findByIdAndDeleted(currentNodeGroup.getSectionId(), "N")
                .orElseThrow(() -> new EntityNotFoundException("Section not found for current node group's section: " + currentNodeGroup.getSectionId()));

        Optional<TbSection> nextSectionOpt = sectionRepository.findNextInCourse(currentSectionForNextSearch.getCourseId(), currentSectionForNextSearch.getOrder().intValue());

        if (nextSectionOpt.isPresent()) {
            TbSection nextSection = nextSectionOpt.get();
            Optional<TbNodeGroup> firstNodeGroupInNextSectionOpt = nodeGroupRepository.findFirstInNextSection(nextSection.getId());

            if (firstNodeGroupInNextSectionOpt.isPresent()) {
                return Optional.of(NodeGroupDto.NextNodeGroupResponseDto.buildResponseDto(nextSection, firstNodeGroupInNextSectionOpt.get()));
            }
        }
        return Optional.empty();
    }


}
