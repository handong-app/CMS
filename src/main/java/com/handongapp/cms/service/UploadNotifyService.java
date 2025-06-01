package com.handongapp.cms.service;


import com.handongapp.cms.dto.v1.S3Dto;

public interface UploadNotifyService {
    void nodeFileUploadComplete(S3Dto.UploadCompleteRequest dto);
}