package com.handongapp.cms.dto.v1;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;

public class S3Dto {
    private S3Dto() {}

    @Data
    @Builder
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
    @Schema(description = "S3 업로드 URL 응답")
    public static class UploadUrlResponse {
        private String presignedUrl;
    }

    @Data
    @Builder
    @Schema(description = "업로드 완료 알림")
    public static class UploadCompleteDto {
        private String filename;
        private String filetype;
    }

    @Data
    @Builder
    @Schema(description = "S3 다운로드 URL 응답")
    public static class DownloadUrlResponse {
        private String presignedUrl;
    }
}
