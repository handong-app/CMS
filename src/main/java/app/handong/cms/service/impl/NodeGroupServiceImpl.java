package app.handong.cms.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import app.handong.cms.domain.TbNodeGroup;
import app.handong.cms.domain.TbSection;
import app.handong.cms.dto.v1.NodeGroupDto;
import app.handong.cms.exception.file.PresignedUrlCreationException;
import app.handong.cms.repository.NodeGroupRepository;
import app.handong.cms.repository.SectionRepository;
import app.handong.cms.service.NodeGroupService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import app.handong.cms.mapper.NodeGroupMapper;
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
