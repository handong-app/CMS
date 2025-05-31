package com.handongapp.cms.service;

import com.handongapp.cms.dto.v1.S3Dto;

import java.net.URL;


public interface PresignedUrlService {
    S3Dto.UploadUrlResponse generateUploadUrl(String path, String id, String originalFilename, String extension, String contentType);
    URL generateDownloadUrl(String key);

    S3Dto.UploadUrlResponse generateNodeFileUploadUrl(S3Dto.NodeFileUploadUrlRequest request, String userId);
}
