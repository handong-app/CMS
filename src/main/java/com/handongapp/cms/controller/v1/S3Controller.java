package com.handongapp.cms.controller.v1;

import com.handongapp.cms.dto.v1.S3Dto;
import com.handongapp.cms.service.PresignedUrlService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/s3")
@RequiredArgsConstructor
public class S3Controller {

    private final PresignedUrlService presignedUrlService;

    @PostMapping("/upload-url")
    public ResponseEntity<S3Dto.UploadUrlResponse> generateUploadUrl(
            @RequestBody S3Dto.UploadUrlRequest request) {
        return ResponseEntity.ok(
                S3Dto.UploadUrlResponse.builder()
                        .presignedUrl(presignedUrlService.generateUploadUrl(request.getFilename(), request.getContentType()).toString())
                        .build()
        );
    }

    @GetMapping("/download-url")
    public ResponseEntity<S3Dto.DownloadUrlResponse> generateDownloadUrl(
            @RequestParam("filename") String filename) {
        return ResponseEntity.ok(
                S3Dto.DownloadUrlResponse.builder()
                        .presignedUrl(presignedUrlService.generateDownloadUrl(filename).toString())
                        .build()
        );
    }
}