package com.handongapp.cms.service;

import com.handongapp.cms.dto.v1.S3Dto;


public interface PresignedUrlService {
    S3Dto.UploadUrlResponse generateNodeFileUploadUrl(S3Dto.NodeFileUploadUrlRequest request, String userId);
}
