package app.handong.cms.service;

import app.handong.cms.dto.ProgressDto;

public interface ProgressService {

    ProgressDto.Response startProgress(String userId, ProgressDto.Request request);
    
    ProgressDto.Response endProgress(String userId, ProgressDto.Request request);
}
