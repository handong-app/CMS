package com.handongapp.cms.dto.v1;

import com.handongapp.cms.domain.TbSection;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.time.LocalDateTime;

public class SectionDto {

    private SectionDto() {
        // Prevent instantiation
    }

    // Response DTO
    @Data
    public static class Response {
        private final String id;
        private final String courseId;
        private final String title;
        private final String description;
        private final Integer order;
        private final LocalDateTime createdAt;
        private final LocalDateTime updatedAt;

        public Response(String id, String courseId, String title, String description, 
                      Integer order, LocalDateTime createdAt, LocalDateTime updatedAt) {
            this.id = id;
            this.courseId = courseId;
            this.title = title;
            this.description = description;
            this.order = order;
            this.createdAt = createdAt;
            this.updatedAt = updatedAt;
        }

        public static Response from(TbSection entity) {
            if (entity == null) return null;
            return new Response(
                    entity.getId(),
                    entity.getCourseId(),
                    entity.getTitle(),
                    entity.getDescription(),
                    entity.getOrder(),
                    entity.getCreatedAt(),
                    entity.getUpdatedAt()
            );
        }
    }

    // CreateRequest DTO
    @Data
    public static class CreateRequest {
        @NotBlank
        private final String title;
        private final String description;
        private final Integer order;

        public CreateRequest(String title, String description, Integer order) {
            this.title = title;
            this.description = description;
            this.order = order;
        }

        public TbSection toEntity(String courseId) {
            TbSection section = new TbSection();
            section.setCourseId(courseId); // 파라미터로 받은 courseId 사용
            section.setTitle(this.title);
            section.setDescription(this.description);
            section.setOrder(this.order);
            return section;
        }
    }

    // UpdateRequest DTO
    @Data
    public static class UpdateRequest {
        private final String title;
        private final String description;
        private final Integer order;

        public UpdateRequest(String title, String description, Integer order) {
            this.title = title;
            this.description = description;
            this.order = order;
        }

        public void applyTo(TbSection entity) {
            if (this.title != null) {
                entity.setTitle(this.title);
            }
            if (this.description != null) {
                entity.setDescription(this.description);
            }
            if (this.order != null) {
                entity.setOrder(this.order);
            }
        }
    }
}
