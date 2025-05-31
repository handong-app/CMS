package com.handongapp.cms.controller.v1;

import com.handongapp.cms.dto.v1.S3Dto;
import com.handongapp.cms.security.PrincipalDetails;
import com.handongapp.cms.service.PresignedUrlService;
import com.handongapp.cms.service.UploadNotifyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/s3")
@RequiredArgsConstructor
public class S3Controller {

    private final PresignedUrlService presignedUrlService;
    private final UploadNotifyService uploadNotifyService;

    @PostMapping("/upload-url")
    public ResponseEntity<S3Dto.UploadUrlResponse> generateUploadUrl(
            @RequestBody S3Dto.UploadUrlRequest request) {
        return ResponseEntity.ok(
                S3Dto.UploadUrlResponse.builder()
                        .presignedUrl(presignedUrlService.generateUploadUrl(request.getFilename(), request.getContentType()).toString())
                        .build()
        );
    }

    @PostMapping("/upload-complete")
    public ResponseEntity<Void> notifyUploadComplete(@RequestBody S3Dto.UploadCompleteDto dto) {
        uploadNotifyService.notifyUploadComplete(dto);
        return ResponseEntity.ok().build();
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

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/upload-url/node-file")
    public ResponseEntity<S3Dto.UploadUrlResponse> generateNodeFileUploadUrl(
            @RequestBody S3Dto.NodeFileUploadUrlRequest request,
            @AuthenticationPrincipal PrincipalDetails principalDetails) {
        return ResponseEntity.ok(presignedUrlService.generateNodeFileUploadUrl(request, principalDetails.getTbUser().getId()));
    }
}