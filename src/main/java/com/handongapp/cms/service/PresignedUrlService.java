package com.handongapp.cms.service;

import com.handongapp.cms.dto.v1.S3Dto;

import java.net.URL;
import java.time.Duration;


public interface PresignedUrlService {
    S3Dto.UploadUrlResponse generateNodeFileUploadUrl(S3Dto.NodeFileUploadUrlRequest request, String userId);
    S3Dto.UploadUrlResponse generateBannerUploadUrl(String targetType, String targetId, String originalFilename, String userId);

    URL generateDownloadUrl(String key, Duration duration);
    URL generateDownloadUrlWithOriginalFileName(String key, String originalFileName, Duration duration);
}
