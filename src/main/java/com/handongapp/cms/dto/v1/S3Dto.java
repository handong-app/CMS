package com.handongapp.cms.dto.v1;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;

public class S3Dto {
    private S3Dto() {}

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "S3 업로드 URL 요청")
    public static class UploadUrlRequest {
        @NotBlank(message = "파일명은 필수입니다")
        private String filename;
        @NotBlank(message = "콘텐츠 타입은 필수입니다")
        @Pattern(
                regexp = "^[a-zA-Z0-9][a-zA-Z0-9\\!\\*'\\(\\)\\;\\:\\@\\&\\=\\+\\$\\,\\/\\?\\%\\#\\[\\]\\-\\_\\.\\~]*$",
                message = "유효하지 않은 콘텐츠 타입입니다"
        )
        private String contentType;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "S3 업로드 URL 응답")
    public static class UploadUrlResponse {
        private String presignedUrl;
        private String fileKey;
        private String fileListId;
        private String originalFilename;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "업로드 완료 알림")
    public static class UploadCompleteRequest {
        @NotBlank(message = "id는 필수입니다")
        private String id;
        @NotBlank(message = "fileKey 는 필수입니다")
        private String fileKey;
        @NotBlank(message = "fileListId 는 필수입니다")
        private String fileListId;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "S3 다운로드 URL 응답")
    public static class DownloadUrlResponse {
        private String presignedUrl;
    }


    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "노드 파일 S3 업로드 URL 요청")
    public static class NodeFileUploadUrlRequest {
        @NotBlank(message = "파일명은 필수입니다")
        private String filename;
        @NotBlank(message = "노드 ID는 필수입니다")
        private String nodeId;
    }
}
