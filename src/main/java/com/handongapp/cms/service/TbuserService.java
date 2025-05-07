package com.handongapp.cms.service;

import com.handongapp.cms.domain.Tbuser;
import com.handongapp.cms.security.dto.GoogleUserInfoResponse;

public interface TbuserService {
    Tbuser saveOrUpdateUser(String userId, String email, String name);
    Tbuser processGoogleUser(GoogleUserInfoResponse googleUserInfoResponse);
}