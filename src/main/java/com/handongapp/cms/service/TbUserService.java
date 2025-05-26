package com.handongapp.cms.service;

import com.handongapp.cms.domain.TbUser;
import com.handongapp.cms.dto.TbUserDto;
import com.handongapp.cms.security.dto.GoogleUserInfoResponse;

import java.util.Optional;

public interface TbUserService {
    TbUser saveOrUpdateUser(String userId, String email, String name);
    TbUser processGoogleUser(GoogleUserInfoResponse googleUserInfoResponse);
    void updateUserProfile(TbUserDto.UserProfileReqDto reqDto, String userId);
    Optional<TbUserDto.UserProfileResDto> findUserId(String userId);
}