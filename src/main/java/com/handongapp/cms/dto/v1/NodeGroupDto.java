package com.handongapp.cms.dto.v1;

import com.handongapp.cms.domain.TbNodeGroup;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.time.LocalDateTime;

public class NodeGroupDto {

    private NodeGroupDto() {
        // Prevent instantiation
    }

    // Response DTO
    @Data
    public static class Response {
        private final String id;
        private final String sectionId;
        private final String title;
        private final Integer order;
        private final LocalDateTime createdAt;
        private final LocalDateTime updatedAt;

        public Response(String id, String sectionId, String title, Integer order,
                      LocalDateTime createdAt, LocalDateTime updatedAt) {
            this.id = id;
            this.sectionId = sectionId;
            this.title = title;
            this.order = order;
            this.createdAt = createdAt;
            this.updatedAt = updatedAt;
        }

        public static Response from(TbNodeGroup entity) {
            if (entity == null) return null;
            return new Response(
                    entity.getId(),
                    entity.getSectionId(),
                    entity.getTitle(),
                    entity.getOrder(),
                    entity.getCreatedAt(),
                    entity.getUpdatedAt()
            );
        }
    }

    // CreateRequest DTO
    @Data
    public static class CreateRequest {
        private String sectionId;
        
        @NotBlank
        private final String title;
        
        private final Integer order;

        public CreateRequest(String sectionId, String title, Integer order) {
            this.sectionId = sectionId;
            this.title = title;
            this.order = order;
        }

        public void setSectionId(String sectionId) {
            this.sectionId = sectionId;
        }

        public TbNodeGroup toEntity() {
            TbNodeGroup nodeGroup = new TbNodeGroup();
            nodeGroup.setSectionId(this.sectionId);
            nodeGroup.setTitle(this.title);
            nodeGroup.setOrder(this.order);
            return nodeGroup;
        }
    }

    // UpdateRequest DTO
    @Data
    public static class UpdateRequest {
        private final String title;
        private final Integer order;

        public UpdateRequest(String title, Integer order) {
            this.title = title;
            this.order = order;
        }

        public void applyTo(TbNodeGroup entity) {
            if (this.title != null) {
                entity.setTitle(this.title);
            }
            if (this.order != null) {
                entity.setOrder(this.order);
            }
        }
    }
}
