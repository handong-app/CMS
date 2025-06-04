package com.handongapp.cms.service;

import com.handongapp.cms.auth.dto.GoogleUserInfoResponse;
import com.handongapp.cms.domain.TbUser;
import com.handongapp.cms.dto.v1.ProgramDto;
import com.handongapp.cms.dto.v1.UserDto;

import java.util.List;

public interface UserService {
    TbUser saveOrUpdateUser(String userId, String email, String name);
    TbUser processGoogleUser(GoogleUserInfoResponse googleUserInfoResponse);
    void updateUserProfile(UserDto.UserProfileReqDto reqDto, String userId);
    UserDto.UserProfileResDto findUserId(String userId);
    void updateUserProfileImage(UserDto.UserProfileImageReqDto reqDto, String userId);
    UserDto.UserProfileLastResDto getLastUserByNodeGroup(String userId);
    List<ProgramDto.ResponseDto> getUserPrograms(String userId);
}