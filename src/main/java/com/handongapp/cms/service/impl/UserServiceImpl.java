package com.handongapp.cms.service.impl;

import com.handongapp.cms.domain.TbClubRole;
import com.handongapp.cms.domain.TbUser;
import com.handongapp.cms.domain.TbUserClubRole;
import com.handongapp.cms.dto.v1.UserDto;
import com.handongapp.cms.mapper.UserMapper;
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

    private final UserRepository userRepository;
    private final ClubRoleRepository clubRoleRepository;
    private final UserClubRoleRepository userClubRoleRepository;
    private final UserMapper userMapper;

    public UserServiceImpl(UserRepository userRepository,
                           ClubRoleRepository clubRoleRepository,
                           UserClubRoleRepository userClubRoleRepository,
                           UserMapper userMapper) {
            this.userRepository = userRepository;
            this.clubRoleRepository = clubRoleRepository;
            this.userClubRoleRepository = userClubRoleRepository;
            this.userMapper = userMapper;
        }

        public TbUser saveOrUpdateUser(String userId, String email, String name) {
            return userRepository.findById(userId)
                    .map(user -> {
                        user.setEmail(email);
                        user.setName(name);
                        return userRepository.save(user);
                    })
                    .orElseGet(() -> userRepository.save(TbUser.of( userId, name, email, null, false)));
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

            return userRepository.findByGoogleSub(googleUserInfoResponse.getId())
                    .orElseGet(() -> {
                        TbUser tbuser = userRepository.save(
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

            userRepository.findById(userId).ifPresent(tbUser -> {
                tbUser.setName(reqDto.getName());
                tbUser.setStudentId(reqDto.getStudentId());
                tbUser.setEmail(reqDto.getEmail());
                tbUser.setPhone(reqDto.getPhone());
                tbUser.setPictureUrl(reqDto.getProfileImage());
            });
        }

        @Override
        public UserDto.UserProfileResDto findUserId(String userId) {
            UserDto.UserProfileResDto userProfileResDto = UserDto.UserProfileResDto.of(userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found")));
            return userProfileResDto;
        }

        @Override
        @Transactional
        public void updateUserProfileImage(UserDto.UserProfileImageReqDto reqDto, String userId) {
            userRepository.findById(userId).ifPresent(tbUser -> {
                tbUser.setPictureUrl(reqDto.getPictureUrl());
            });
        }

        @Override
        public UserDto.UserProfileLastResDto getLastUserByNodeGroup(String userId) {
            ArrayList<UserDto.LastProgramResDto> userProfileLastResDto
                    = (ArrayList<UserDto.LastProgramResDto>) userMapper.findLastNodeGroupByCourseForUser(userId);
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
            userClubRoleRepository.save(userClubRole);
        }

        public static class InvalidEmailDomainException extends RuntimeException {
            public InvalidEmailDomainException(String message) {
                super(message);
            }
        }
    }
