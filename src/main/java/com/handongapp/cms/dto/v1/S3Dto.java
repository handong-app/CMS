package com.handongapp.cms.dto.v1;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

public class S3Dto {
    private S3Dto() {}

    @Builder
    @Schema
    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class UploadUrlRequest {
        private String filename;
        private String contentType;
    }

    @Builder
    @Schema
    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class UploadUrlResponse {
        private String presignedUrl;
    }

    @Builder
    @Schema
    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class UploadCompleteDto {
        private String filename;
        private String contentType;
    }

    @Builder
    @Schema
    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class DownloadUrlResponse {
        private String presignedUrl;
    }
}
