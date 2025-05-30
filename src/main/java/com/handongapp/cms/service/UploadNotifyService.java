package com.handongapp.cms.service;


import com.handongapp.cms.dto.v1.S3Dto.UploadCompleteDto;

public interface UploadNotifyService {
    void notifyUploadComplete(UploadCompleteDto dto);
}