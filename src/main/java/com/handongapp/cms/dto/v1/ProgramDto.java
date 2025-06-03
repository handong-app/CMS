package com.handongapp.cms.dto.v1;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.time.LocalDateTime;

public class ProgramDto {
    @Schema(description = "Program Response Dto")
    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ResponseDto {
        private String programId;

        @NonNull
        private String clubId;

        private String clubSlug;

        @NonNull
        private String userId;

        private String name;

        private String slug;

        private String description;

        @NonNull
        private LocalDateTime startDate;

        @NonNull
        private LocalDateTime endDate;
    }
}
