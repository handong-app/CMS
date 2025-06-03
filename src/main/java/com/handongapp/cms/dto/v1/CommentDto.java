package com.handongapp.cms.dto.v1;

import com.handongapp.cms.domain.TbComment;
import com.handongapp.cms.domain.TbCommentOfCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDateTime;

public class CommentDto {

    private CommentDto() {
        // Prevent instantiation
    }

    // Response DTO
    @Getter
    public static class Response {
        private final String id;
        private final String targetId;
        private final String userId;
        private final String categoryId; 
        private final String content;
        private final LocalDateTime createdAt;
        private final LocalDateTime updatedAt;
        private final String categorySlug;
        private final String categoryLabel;
        private final String categoryEmoji;

        // Constructor for final fields
        public Response(String id, String targetId, String userId, String categoryId, String content, LocalDateTime createdAt, LocalDateTime updatedAt, String categorySlug, String categoryLabel, String categoryEmoji) {
            this.id = id;
            this.targetId = targetId;
            this.userId = userId;
            this.categoryId = categoryId;
            this.content = content;
            this.createdAt = createdAt;
            this.updatedAt = updatedAt;
            this.categorySlug = categorySlug;
            this.categoryLabel = categoryLabel;
            this.categoryEmoji = categoryEmoji;
        }

        /**
         * TbComment 엔티티만 사용하여 Response 객체 생성
         */
        public static Response from(TbComment entity) {
            if (entity == null) return null;
            return new Response(
                    entity.getId(),
                    entity.getTargetId(),
                    entity.getUserId(),
                    entity.getCategoryId(), 
                    entity.getContent(),
                    entity.getCreatedAt(),
                    entity.getUpdatedAt(),
                    null, // categorySlug
                    null, // categoryLabel
                    null  // categoryEmoji
            );
        }
        
        /**
         * TbComment 엔티티와 TbCommentOfCategory 엔티티를 사용하여 Response 객체 생성
         */
        public static Response from(TbComment entity, TbCommentOfCategory category) {
            if (entity == null) return null;
            return new Response(
                    entity.getId(),
                    entity.getTargetId(),
                    entity.getUserId(),
                    entity.getCategoryId(), 
                    entity.getContent(),
                    entity.getCreatedAt(),
                    entity.getUpdatedAt(),
                    category != null ? category.getSlug() : null,
                    category != null ? category.getLabel() : null,
                    category != null ? category.getEmoji() : null
            );
        }
    }

    // CreateRequest DTO
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateRequest {

        @NotBlank(message = "대상 ID는 필수입니다")
        private String targetId;

        @NotBlank(message = "내용은 필수입니다")
        @Size(max = 1000, message = "내용은 1000자를 초과할 수 없습니다")
        private String content;

        @NotBlank(message = "카테고리 ID는 필수입니다")
        private String categoryId;

        public TbComment toEntity(String userId) {
            TbComment comment = new TbComment();
            comment.setTargetId(this.targetId);
            comment.setUserId(userId);
            comment.setContent(this.content);
            comment.setCategoryId(this.categoryId); 
            comment.setDeleted("N"); 
            return comment;
        }
    }

    // UpdateRequest DTO
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateRequest {
        private String content;
        private String categoryId;

        public void applyTo(TbComment entity) {
            if (this.content != null) {
                entity.setContent(this.content);
            }
            if (this.categoryId != null) {
                entity.setCategoryId(this.categoryId);
            }
        }
    }
}
