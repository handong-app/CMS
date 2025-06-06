package app.handong.cms.dto.v1;

import app.handong.cms.domain.TbCommentOfCategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

public class CommentOfCategoryDto {

    private CommentOfCategoryDto() {
        // Prevent instantiation
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private String id;
        private String courseId;
        private String slug;
        private String label;
        private String emoji;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public static Response from(TbCommentOfCategory entity) {
            if (entity == null) return null;
            return Response.builder()
                    .id(entity.getId())
                    .courseId(entity.getCourseId())
                    .slug(entity.getSlug())
                    .label(entity.getLabel())
                    .emoji(entity.getEmoji())
                    .createdAt(entity.getCreatedAt())
                    .updatedAt(entity.getUpdatedAt())
                    .build();
        }
    }
}
