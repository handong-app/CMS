package com.handongapp.cms.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.handongapp.cms.domain.TbNodeGroup;
import com.handongapp.cms.domain.TbSection;
import com.handongapp.cms.dto.v1.NodeGroupDto;
import com.handongapp.cms.exception.file.PresignedUrlCreationException;
import com.handongapp.cms.repository.NodeGroupRepository;
import com.handongapp.cms.repository.SectionRepository;
import com.handongapp.cms.service.NodeGroupService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.lang.Nullable;
import com.handongapp.cms.mapper.NodeGroupMapper;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
@RequiredArgsConstructor
public class NodeGroupServiceImpl implements NodeGroupService {

    private static final String FIELD_FILE_KEY = "fileKey";
    private static final String FIELD_STATUS = "status";
    private static final String FIELD_ORIGINAL_FILE_NAME = "originalFileName";
    private static final String FIELD_PATH = "path";
    private static final String STATUS_UPLOADED = "UPLOADED";
    private static final String STATUS_TRANSCODE_COMPLETED = "TRANSCODE_COMPLETED";
    private static final String FIELD_TYPE = "type";
    private static final String FIELD_DATA = "data";
    private static final String FIELD_FILE = "file";
    private static final String TYPE_IMAGE = "IMAGE";
    private static final String TYPE_FILE = "FILE";
    private static final String TYPE_VIDEO = "VIDEO";

    private final NodeGroupMapper nodeGroupMapper;
    private final ObjectMapper objectMapper;
    private final NodeGroupRepository nodeGroupRepository;
    private final SectionRepository sectionRepository;
    private final PresignedUrlServiceImpl presignedUrlService;

    @Override
    @Transactional
    public NodeGroupDto.Response create(NodeGroupDto.CreateRequest req) {
        TbNodeGroup newNodeGroup = req.toEntity(); // Assumes toEntity sets sectionId and order from req
        TbNodeGroup persistedNodeGroup = reorderAndPersistNodeGroups(newNodeGroup.getSectionId(), newNodeGroup, newNodeGroup.getOrder());
        return NodeGroupDto.Response.from(persistedNodeGroup);
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
        TbNodeGroup entityToUpdate = nodeGroupRepository.findByIdAndDeleted(id, "N")
                .orElseThrow(() -> new EntityNotFoundException("NodeGroup not found with id: " + id));
        
        String sectionId = entityToUpdate.getSectionId();
        
        // Apply changes from DTO. Assumes req.applyTo updates entityToUpdate.order if req.getOrder() is not null.
        req.applyTo(entityToUpdate);
        
        // entityToUpdate.getOrder() will be the requested new order if specified in DTO, or original order if not.
        TbNodeGroup updatedEntity = reorderAndPersistNodeGroups(sectionId, entityToUpdate, entityToUpdate.getOrder());
        return NodeGroupDto.Response.from(updatedEntity);
    }

    @Override
    @Transactional
    public void deleteSoft(String id) {
        TbNodeGroup entity = nodeGroupRepository.findByIdAndDeleted(id, "N")
                .orElseThrow(() -> new EntityNotFoundException("NodeGroup not found with id: " + id));
        
        String sectionId = entity.getSectionId();
        entity.setDeleted("Y");
        entity.setOrder(null); // Mark order as irrelevant for soft-deleted items
        nodeGroupRepository.save(entity); // Persist the soft deletion

        // Reorder remaining active node groups
        reorderAndPersistNodeGroups(sectionId, null, null);
    }

    private TbNodeGroup reorderAndPersistNodeGroups(String sectionId, @Nullable TbNodeGroup targetNodeGroup, @Nullable Integer requestedOrderForTarget) {
        List<TbNodeGroup> currentNodeGroupsInDb = nodeGroupRepository.findBySectionIdAndDeletedOrderByOrderAsc(sectionId, "N");

        List<TbNodeGroup> nodeGroupsToProcess = new ArrayList<>();
        boolean isTargetNew = (targetNodeGroup != null && targetNodeGroup.getId() == null);

        for (TbNodeGroup ng : currentNodeGroupsInDb) {
            if (targetNodeGroup != null && ng.getId() != null && ng.getId().equals(targetNodeGroup.getId()) && !isTargetNew) {
                continue;
            }
            nodeGroupsToProcess.add(ng);
        }

        TbNodeGroup nodeGroupToReturn = targetNodeGroup;

        if (targetNodeGroup != null) {
            int insertionIndex;
            Integer effectiveOrder = requestedOrderForTarget;

            if (effectiveOrder == null) {
                if (!isTargetNew) { 
                    effectiveOrder = targetNodeGroup.getOrder(); 
                }
            }

            if (effectiveOrder == null) {
                 insertionIndex = nodeGroupsToProcess.size();
            } else {
                insertionIndex = Math.max(0, Math.min(effectiveOrder, nodeGroupsToProcess.size()));
            }
            nodeGroupsToProcess.add(insertionIndex, targetNodeGroup);
        }

        for (int i = 0; i < nodeGroupsToProcess.size(); i++) {
            TbNodeGroup nodeGroup = nodeGroupsToProcess.get(i);
            nodeGroup.setOrder(i);
        }

        if (!nodeGroupsToProcess.isEmpty()) {
            nodeGroupRepository.saveAll(nodeGroupsToProcess);
        }
        
        return nodeGroupToReturn;
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
                    JsonNode typeNode = node.get(FIELD_TYPE);
                    if (typeNode == null) continue;
                    String type = typeNode.asText();
                    if (TYPE_IMAGE.equals(type) || TYPE_FILE.equals(type)) {
                        JsonNode dataNode = node.get(FIELD_DATA);
                        if (dataNode == null) continue;
                        JsonNode fileNode = dataNode.get(FIELD_FILE);
                        if (fileNode != null) {
                            handleFileNodePresignedUrl(fileNode);
                        }
                    } else if (TYPE_VIDEO.equals(type)) {
                        JsonNode dataNode = node.get(FIELD_DATA);
                        if (dataNode == null) continue;
                        JsonNode fileNode = dataNode.get(FIELD_FILE);
                        if (fileNode != null) {
                            handleVideoFileNodePlaylist(node, fileNode);
                        }
                    }
                }
            }
            return objectMapper.writeValueAsString(root);
        } catch (PresignedUrlCreationException e){
            throw e;
        }
        catch (Exception e) {
            throw new IllegalStateException("NodeGroup JSON 파싱/직렬화에 실패했습니다.", e);
        }
    }

    private void handleFileNodePresignedUrl(JsonNode fileNode) {
        if (fileNode.has(FIELD_FILE_KEY)
                && fileNode.has(FIELD_STATUS)
                && STATUS_UPLOADED.equals(fileNode.get(FIELD_STATUS).asText())) {

            String fileKey = fileNode.get(FIELD_FILE_KEY).asText();
            String presignedUrl;

            if (fileNode.has(FIELD_ORIGINAL_FILE_NAME)) {
                String originalFileName = fileNode.get(FIELD_ORIGINAL_FILE_NAME).asText();
                if (originalFileName != null && !originalFileName.trim().isEmpty()) {
                    presignedUrl = presignedUrlService
                            .generateDownloadUrlWithOriginalFileName(fileKey, originalFileName, Duration.ofHours(24))
                            .toString();
                } else {
                    presignedUrl = presignedUrlService
                            .generateDownloadUrl(fileKey, Duration.ofHours(24))
                            .toString();
                }
            } else {
                presignedUrl = presignedUrlService
                        .generateDownloadUrl(fileKey, Duration.ofHours(24))
                        .toString();
            }

            ((ObjectNode) fileNode).put("presignedUrl", presignedUrl);
        }
        ((ObjectNode) fileNode).remove(FIELD_FILE_KEY);
    }

    private void handleVideoFileNodePlaylist(JsonNode node, JsonNode fileNode) {
        if (fileNode.has(FIELD_PATH)
                && fileNode.has(FIELD_STATUS)
                && STATUS_TRANSCODE_COMPLETED.equals(fileNode.get(FIELD_STATUS).asText())) {

            String masterM3u8Endpoint = "/api/v1/stream/" + node.get("id").asText() + "/master.m3u8";
            ((ObjectNode) fileNode).put("playlist", masterM3u8Endpoint);
        }
        ((ObjectNode) fileNode).remove(FIELD_PATH);
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
