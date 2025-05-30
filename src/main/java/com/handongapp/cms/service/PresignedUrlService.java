package com.handongapp.cms.service;

import java.net.URL;


public interface PresignedUrlService {
    URL generateUploadUrl(String filename, String contentType);
    URL generateDownloadUrl(String key);
}
