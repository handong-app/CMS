package com.handongapp.cms.service;


import com.handongapp.cms.dto.v1.S3Dto;

public interface UploadNotifyService {
    void completeUpload(S3Dto.UploadCompleteRequest request);
    void nodeFileUploadComplete(S3Dto.UploadCompleteRequest dto);
}