package com.handongapp.cms.dto.v1;

import com.handongapp.cms.domain.TbNode;
import com.handongapp.cms.domain.enums.ProgramProgressState;
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
        private final String attachmentUrl;
        private final LocalDateTime createdAt;
        private final LocalDateTime updatedAt;

        public Response(String id, String nodeGroupId, TbNode.NodeType type, Boolean commentPermitted, Map<String, Object> data, Integer order, String attachmentUrl, LocalDateTime createdAt, LocalDateTime updatedAt) {
            this.id = id;
            this.nodeGroupId = nodeGroupId;
            this.type = type;
            this.commentPermitted = commentPermitted;
            this.data = data;
            this.order = order;
            this.attachmentUrl = attachmentUrl;
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
                    entity.getAttachmentUrl(),
                    entity.getCreatedAt(),
                    entity.getUpdatedAt()
            );
        }
    }

    // CreateRequest DTO
    @Data
    public static class CreateRequest {
        private String nodeGroupId;
        
        @NotNull
        private final TbNode.NodeType type;
        private final Boolean commentPermitted;
        private final Map<String, Object> data;
        private final Integer order;
        private final String attachmentUrl;

        public CreateRequest(String nodeGroupId, TbNode.NodeType type, Boolean commentPermitted, Map<String, Object> data, Integer order, String attachmentUrl) {
            this.nodeGroupId = nodeGroupId;
            this.type = type;
            this.commentPermitted = commentPermitted;
            this.data = data;
            this.order = order;
            this.attachmentUrl = attachmentUrl;
        }

        public TbNode toEntity() {
            TbNode node = new TbNode();
            node.setNodeGroupId(this.nodeGroupId); // DTO의 nodeGroupId 사용
            node.setType(this.type);
            node.setCommentPermitted(this.commentPermitted);
            node.setData(this.data);
            node.setOrder(this.order);
            node.setAttachmentUrl(this.attachmentUrl);
            // id, deleted, createdAt, updatedAt는 AuditingFields 또는 JPA에 의해 자동 관리
            return node;
        }
    }

    // UpdateRequest DTO
    @Data
    public static class UpdateRequest {
        private final Boolean commentPermitted;
        private final Map<String, Object> data;
        private final Integer order;
        private final String attachmentUrl;

        public UpdateRequest(Boolean commentPermitted, Map<String, Object> data, Integer order, String attachmentUrl) {
            this.commentPermitted = commentPermitted;
            this.data = data;
            this.order = order;
            this.attachmentUrl = attachmentUrl;
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
            if (this.attachmentUrl != null) {
                entity.setAttachmentUrl(this.attachmentUrl);
            }
        }
    }

    @AllArgsConstructor
    @NoArgsConstructor
    @Setter
    @Getter
    public static class NodeBaseDto {
        //        private String title;  // 노드에 title 추가해야하나?
        private ProgramProgressState type;
        private String order;
    }
}
