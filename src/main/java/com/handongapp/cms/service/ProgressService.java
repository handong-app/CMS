package com.handongapp.cms.service;

import com.handongapp.cms.dto.ProgressDto;

public interface ProgressService {

    ProgressDto.Response startProgress(String userId, ProgressDto.Request request);
    
    ProgressDto.Response endProgress(String userId, ProgressDto.Request request);
}
