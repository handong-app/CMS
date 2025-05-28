package com.handongapp.cms.service.impl;

import com.handongapp.cms.domain.TbClubRole;
import com.handongapp.cms.domain.TbUser;
import com.handongapp.cms.domain.TbUserClubRole;
import com.handongapp.cms.dto.v1.UserDto;
import com.handongapp.cms.mapper.TbUserMapper;
import com.handongapp.cms.repository.ClubRoleRepository;
import com.handongapp.cms.repository.UserClubRoleRepository;
import com.handongapp.cms.repository.UserRepository;
import com.handongapp.cms.auth.dto.GoogleUserInfoResponse;
import com.handongapp.cms.service.UserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Objects;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository tbUserRepository;
    private final ClubRoleRepository tbClubRoleRepository;
    private final UserClubRoleRepository tbUserClubRoleRepository;
    private final TbUserMapper tbUserMapper;

    public UserServiceImpl(UserRepository tbUserRepository,
                           ClubRoleRepository tbClubRoleRepository,
                           UserClubRoleRepository tbUserClubRoleRepository,
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

                        return tbuser;
                    });
        }

        @Override
        @Transactional
        public void updateUserProfile(UserDto.UserProfileReqDto reqDto, String userId) {
            String customUserId = "";
            if (reqDto.getUserId().startsWith("user-"))
                customUserId = reqDto.getUserId().substring(5);

            if (!userId.equals(customUserId))
                throw new RuntimeException("Invalid user access");

            tbUserRepository.findById(customUserId).ifPresent(tbUser -> {
                tbUser.setName(reqDto.getName());
                tbUser.setStudentId(reqDto.getStudentId());
                tbUser.setEmail(reqDto.getEmail());
                tbUser.setPhone(reqDto.getPhone());
                tbUser.setPictureUrl(reqDto.getProfileImage());
            });
        }

        @Override
        public UserDto.UserProfileResDto findUserId(String userId) {
            UserDto.UserProfileResDto userProfileResDto = UserDto.UserProfileResDto.of(tbUserRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found")));
            return userProfileResDto;
        }

        @Override
        @Transactional
        public void updateUserProfileImage(UserDto.UserProfileImageReqDto reqDto, String userId) {
            tbUserRepository.findById(userId).ifPresent(tbUser -> {
                tbUser.setPictureUrl(reqDto.getPictureUrl());
            });
        }

        @Override
        public UserDto.UserProfileLastResDto getLastUserByNodeGroup(String userId) {
            ArrayList<UserDto.LastProgramResDto> userProfileLastResDto
                    = (ArrayList<UserDto.LastProgramResDto>) tbUserMapper.findLastNodeGroupByCourseForUser(userId);
            return userProfileLastResDto.isEmpty() ? null : UserDto.UserProfileLastResDto.of(userProfileLastResDto);
        }


        private void validateEmailDomain(String email, String allowedDomain) {
            if (email == null || !email.toLowerCase().endsWith("@" + allowedDomain)) {
                throw new InvalidEmailDomainException("학교 계정만 회원가입 가능합니다.");
            }
        }

        private String buildUserName(GoogleUserInfoResponse userInfo) {
            return Objects.toString(userInfo.getFamilyName(), "") + Objects.toString(userInfo.getGivenName(), "");
        }

        // maybe using next time.
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
