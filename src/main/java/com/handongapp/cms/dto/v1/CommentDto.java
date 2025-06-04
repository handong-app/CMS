package com.handongapp.cms.dto.v1;

import com.handongapp.cms.domain.TbComment;
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

        // Constructor for final fields
        public Response(String id, String targetId, String userId, String categoryId, String content, LocalDateTime createdAt, LocalDateTime updatedAt) {
            this.id = id;
            this.targetId = targetId;
            this.userId = userId;
            this.categoryId = categoryId;
            this.content = content;
            this.createdAt = createdAt;
            this.updatedAt = updatedAt;
        }

        public static Response from(TbComment entity) {
            if (entity == null) return null;
            return new Response(
                    entity.getId(),
                    entity.getTargetId(),
                    entity.getUserId(),
                    entity.getCategoryId(), 
                    entity.getContent(),
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
