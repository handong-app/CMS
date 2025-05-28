package com.handongapp.cms.service;

import com.handongapp.cms.auth.dto.GoogleUserInfoResponse;
import com.handongapp.cms.domain.TbUser;
import com.handongapp.cms.dto.v1.TbUserDto;

public interface TbUserService {
    TbUser saveOrUpdateUser(String userId, String email, String name);
    TbUser processGoogleUser(GoogleUserInfoResponse googleUserInfoResponse);
    void updateUserProfile(TbUserDto.UserProfileReqDto reqDto, String userId);
    TbUserDto.UserProfileResDto findUserId(String userId);
    void updateUserProfileImage(TbUserDto.UserProfileImageReqDto reqDto, String userId);
    TbUserDto.UserProfileLastResDto getLastUserByNodeGroup(String userId);
}