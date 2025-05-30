package com.handongapp.cms.dto.v1;

import com.handongapp.cms.domain.TbCourse;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;

public class CourseDto {

    private CourseDto() {
        // Prevent instantiation
    }

    // Response DTO
    @Getter
    public static class Response {
        private final String id;
        private final String clubId;
        private final String userId;
        private final String title;
        private final String slug;
        private final String description;
        private final boolean isVisible;
        private final String pictureUrl;
        private final LocalDateTime createdAt;
        private final LocalDateTime updatedAt;

        public Response(String id, String clubId, String userId, String title, String slug, 
                       String description, boolean isVisible, String pictureUrl, 
                       LocalDateTime createdAt, LocalDateTime updatedAt) {
            this.id = id;
            this.clubId = clubId;
            this.userId = userId;
            this.title = title;
            this.slug = slug;
            this.description = description;
            this.isVisible = isVisible;
            this.pictureUrl = pictureUrl;
            this.createdAt = createdAt;
            this.updatedAt = updatedAt;
        }

        public static Response from(TbCourse entity) {
            if (entity == null) return null;
            return new Response(
                    entity.getId(),
                    entity.getClubId(),
                    entity.getUserId(),
                    entity.getTitle(),
                    entity.getSlug(),
                    entity.getDescription(),
                    entity.isVisible(),
                    entity.getPictureUrl(),
                    entity.getCreatedAt(),
                    entity.getUpdatedAt()
            );
        }
    }

    // CreateRequest DTO
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateRequest {

        @NotBlank
        private String title;
        
        private String slug;
        private String description;
        @Builder.Default
        private Boolean isVisible = true;
        private String pictureUrl;

        public TbCourse toEntity(String clubId, String userId) {
            TbCourse course = new TbCourse();
            course.setClubId(clubId); // 파라미터로 받은 clubId 사용
            course.setUserId(userId); // 파라미터로 받은 userId 사용
            course.setTitle(this.title);
            course.setSlug(this.slug);
            course.setDescription(this.description);
            course.setVisible(this.isVisible != null ? this.isVisible : true);
            course.setPictureUrl(this.pictureUrl);
            return course;
        }
    }

    // UpdateRequest DTO
    @Getter
    public static class UpdateRequest {
        private final String title;
        private final String slug;
        private final String description;
        private final Boolean isVisible;
        private final String pictureUrl;

        public UpdateRequest(String title, String slug, String description, 
                           Boolean isVisible, String pictureUrl) {
            this.title = title;
            this.slug = slug;
            this.description = description;
            this.isVisible = isVisible;
            this.pictureUrl = pictureUrl;
        }

        public void applyTo(TbCourse entity) {
            if (this.title != null) {
                entity.setTitle(this.title);
            }
            if (this.slug != null) {
                entity.setSlug(this.slug);
            }
            if (this.description != null) {
                entity.setDescription(this.description);
            }
            if (this.isVisible != null) {
                entity.setVisible(this.isVisible);
            }
            if (this.pictureUrl != null) {
                entity.setPictureUrl(this.pictureUrl);
            }
        }
    }
}
