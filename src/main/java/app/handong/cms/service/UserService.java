package app.handong.cms.service;

import app.handong.cms.auth.dto.GoogleUserInfoResponse;
import app.handong.cms.domain.TbUser;
import app.handong.cms.dto.v1.ProgramDto;
import app.handong.cms.dto.v1.UserDto;

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