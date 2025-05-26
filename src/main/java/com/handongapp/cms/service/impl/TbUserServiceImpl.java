package com.handongapp.cms.service.impl;

import com.handongapp.cms.domain.TbClubRole;
import com.handongapp.cms.domain.TbUser;
import com.handongapp.cms.domain.TbUserClubRole;
import com.handongapp.cms.domain.enums.ClubUserRole;
import com.handongapp.cms.dto.TbUserDto;
import com.handongapp.cms.mapper.TbUserMapper;
import com.handongapp.cms.repository.TbClubRoleRepository;
import com.handongapp.cms.repository.TbUserClubRoleRepository;
import com.handongapp.cms.repository.TbUserRepository;
import com.handongapp.cms.security.dto.GoogleUserInfoResponse;
import com.handongapp.cms.service.TbUserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class TbUserServiceImpl implements TbUserService {

    private final TbUserRepository tbUserRepository;
    private final TbClubRoleRepository tbClubRoleRepository;
    private final TbUserClubRoleRepository tbUserClubRoleRepository;
    private final TbUserMapper tbUserMapper;

    public TbUserServiceImpl(TbUserRepository tbUserRepository,
                             TbClubRoleRepository tbClubRoleRepository,
                             TbUserClubRoleRepository tbUserClubRoleRepository,
                             TbUserMapper tbUserMapper) {
        this.tbUserRepository = tbUserRepository;
        this.tbClubRoleRepository = tbClubRoleRepository;
        this.tbUserClubRoleRepository = tbUserClubRoleRepository;
        this.tbUserMapper = tbUserMapper;
    }

    public TbUser saveOrUpdateUser(String userId, String email, String name) {
        return tbUserRepository.findById(userId)
                .map(user -> {
                    user.setEmail(email);
                    user.setName(name);
                    return tbUserRepository.save(user);
                })
                .orElseGet(() -> tbUserRepository.save(TbUser.of( userId, name, email, null, false)));
    }

     /**
      * Processes Google OAuth user information.
      * Creates a new user if not exists, or returns existing user.
      *
      * @param googleUserInfoResponse Google user information
      * @return User entity
      */
    @Transactional
    public TbUser processGoogleUser(GoogleUserInfoResponse googleUserInfoResponse) {
        String allowedDomain = "handong.ac.kr";
        validateEmailDomain(googleUserInfoResponse.getEmail(), allowedDomain);

        return tbUserRepository.findByGoogleSub(googleUserInfoResponse.getId())
                .orElseGet(() -> {
                    TbUser tbuser = tbUserRepository.save(
                            TbUser.of(
                                    googleUserInfoResponse.getId(),
                                    buildUserName(googleUserInfoResponse),
                                    googleUserInfoResponse.getEmail(),
                                    googleUserInfoResponse.getPicture(),
                                    false
                            )
                    );
                    // todo: change dto..
                    TbClubRole tb = tbClubRoleRepository.save(TbClubRole.of(ClubUserRole.USER, "동아리 가입이 되지 않은 학생"));
                    assignUserClubRole(tbuser, tb);

                    return tbuser;
                });
    }

    @Override
    @Transactional
    public void updateUserProfile(TbUserDto.UserProfileReqDto reqDto, String userId) {
        if (!userId.equals(reqDto.getUserId())) {
            throw new RuntimeException("Invalid user access");
        }

        tbUserRepository.findById(reqDto.getUserId()).ifPresent(tbUser -> {
            tbUser.setName(reqDto.getName());
            tbUser.setStudentId(reqDto.getStudentId());
            tbUser.setEmail(reqDto.getEmail());
            tbUser.setPhone(reqDto.getPhone());
            tbUser.setPictureUrl(reqDto.getProfileImage());
        });
    }

    @Override
    public Optional<TbUserDto.UserProfileResDto> findUserId(String userId) {
        Optional<TbUserDto.UserProfileResDto> userProfileResDto = Optional.of(TbUserDto.UserProfileResDto.of(tbUserRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"))));
        return userProfileResDto;
    }

    @Override
    @Transactional
    public void updateUserProfileImage(TbUserDto.UserProfileImageReqDto reqDto, String userId) {
        tbUserRepository.findById(userId).ifPresent(tbUser -> {
            tbUser.setPictureUrl(reqDto.getProfileImage());
        });
    }

    @Override
    public TbUserDto.UserProfileLastResDto getLastUserByNodeGroup(String userId) {
        ArrayList<TbUserDto.LastProgramResDto> userProfileLastResDto
                = (ArrayList<TbUserDto.LastProgramResDto>) tbUserMapper.findLastNodeGroupByCourseForUser(userId);
        return userProfileLastResDto.isEmpty() ? null : TbUserDto.UserProfileLastResDto.of(userProfileLastResDto);
    }


    private void validateEmailDomain(String email, String allowedDomain) {
        if (email == null || !email.toLowerCase().endsWith("@" + allowedDomain)) {
            throw new InvalidEmailDomainException("학교 계정만 회원가입 가능합니다.");
        }
    }

    private String buildUserName(GoogleUserInfoResponse userInfo) {
        return Objects.toString(userInfo.getFamilyName(), "") + Objects.toString(userInfo.getGivenName(), "");
    }

    private void assignUserClubRole(TbUser tbUser, TbClubRole clubRole) {
        TbUserClubRole userClubRole = TbUserClubRole.of(tbUser.getId(), null, clubRole.getId(), null);
        tbUserClubRoleRepository.save(userClubRole);
    }

    public static class InvalidEmailDomainException extends RuntimeException {
        public InvalidEmailDomainException(String message) {
            super(message);
        }
    }
}
