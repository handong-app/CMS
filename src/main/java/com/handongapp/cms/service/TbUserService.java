package com.handongapp.cms.service;

import com.handongapp.cms.domain.TbUser;
import com.handongapp.cms.auth.dto.GoogleUserInfoResponse;

public interface TbUserService {
    TbUser saveOrUpdateUser(String userId, String email, String name);
    TbUser processGoogleUser(GoogleUserInfoResponse googleUserInfoResponse);
}