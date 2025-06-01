package com.handongapp.cms.dto.v1;

import com.handongapp.cms.domain.TbNode;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Map;

public class NodeDto {

    private NodeDto() {
        // Prevent instantiation
    }

    // Response DTO
    @Data
    public static class Response {
        private final String id;
        private final String nodeGroupId;
        private final TbNode.NodeType type;
        private final Boolean commentPermitted;
        private final Map<String, Object> data;
        private final Integer order;
        private final LocalDateTime createdAt;
        private final LocalDateTime updatedAt;

        public Response(String id, String nodeGroupId, TbNode.NodeType type, Boolean commentPermitted, Map<String, Object> data,
                        Integer order, LocalDateTime createdAt, LocalDateTime updatedAt) {
            this.id = id;
            this.nodeGroupId = nodeGroupId;
            this.type = type;
            this.commentPermitted = commentPermitted;
            this.data = data;
            this.order = order;
            this.createdAt = createdAt;
            this.updatedAt = updatedAt;
        }

        public static Response from(TbNode entity) {
            if (entity == null) return null;
            return new Response(
                    entity.getId(),
                    entity.getNodeGroupId(),
                    entity.getType(),
                    entity.getCommentPermitted(),
                    entity.getData(),
                    entity.getOrder(),
                    entity.getCreatedAt(),
                    entity.getUpdatedAt()
            );
        }
    }

    // CreateRequest DTO
    @Data
    @NoArgsConstructor
    public static class CreateRequest {
        private String nodeGroupId;

        @NotNull
        private TbNode.NodeType type;
        private Boolean commentPermitted;
        private Map<String, Object> data;
        private Integer order;
        public CreateRequest(String nodeGroupId, TbNode.NodeType type, Boolean commentPermitted,
                             Map<String, Object> data, Integer order) {
            this.nodeGroupId = nodeGroupId;
            this.type = type;
            this.commentPermitted = commentPermitted;
            this.data = data;
            this.order = order;
        }

        public TbNode toEntity() {
            TbNode node = new TbNode();
            node.setNodeGroupId(this.nodeGroupId);
            node.setType(this.type);
            node.setCommentPermitted(this.commentPermitted);
            node.setData(this.data);
            node.setOrder(this.order);
            return node;
        }
    }

    // UpdateRequest DTO
    @Data
    public static class UpdateRequest {
        private final Boolean commentPermitted;
        private final Map<String, Object> data;
        private final Integer order;

        public UpdateRequest(Boolean commentPermitted, Map<String, Object> data, Integer order) {
            this.commentPermitted = commentPermitted;
            this.data = data;
            this.order = order;
        }

        public void applyTo(TbNode entity) {
            if (this.commentPermitted != null) {
                entity.setCommentPermitted(this.commentPermitted);
            }
            if (this.data != null) {
                entity.setData(this.data);
            }
            if (this.order != null) {
                entity.setOrder(this.order);
            }
        }
    }

    @AllArgsConstructor
    @NoArgsConstructor
    @Setter
    @Getter
    public static class NodeBaseDto {
        private TbNode.NodeType type;
        private Integer order;
    }
}