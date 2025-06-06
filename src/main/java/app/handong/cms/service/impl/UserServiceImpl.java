package app.handong.cms.service.impl;

import app.handong.cms.auth.dto.GoogleUserInfoResponse;
import app.handong.cms.domain.TbClubRole;
import app.handong.cms.domain.TbUser;
import app.handong.cms.domain.TbUserClubRole;
import app.handong.cms.domain.enums.FileStatus;
import app.handong.cms.dto.v1.ProgramDto;
import app.handong.cms.dto.v1.UserDto;
import app.handong.cms.exception.data.NotFoundException;
import app.handong.cms.mapper.ProgramMapper;
import app.handong.cms.mapper.UserMapper;
import app.handong.cms.repository.ClubRoleRepository;
import app.handong.cms.repository.UserClubRoleRepository;
import app.handong.cms.repository.UserRepository;
import app.handong.cms.service.PresignedUrlService;
import app.handong.cms.service.UserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
//    private final ClubRoleRepository clubRoleRepository;
    private final UserClubRoleRepository userClubRoleRepository;
    private final UserMapper userMapper;
    private final ProgramMapper programMapper;
    private final PresignedUrlService presignedUrlService;

    public UserServiceImpl(UserRepository userRepository,
                           ClubRoleRepository clubRoleRepository,
                           UserClubRoleRepository userClubRoleRepository,
                           UserMapper userMapper, ProgramMapper programMapper,
                           PresignedUrlService presignedUrlService) {
            this.userRepository = userRepository;
//            this.clubRoleRepository = clubRoleRepository;
            this.userClubRoleRepository = userClubRoleRepository;
            this.userMapper = userMapper;
        this.programMapper = programMapper;
        this.presignedUrlService = presignedUrlService;
    }

    public TbUser saveOrUpdateUser(String userId, String email, String name) {
        return userRepository.findById(userId)
                .map(user -> {
                    user.setEmail(email);
                    user.setName(name);
                    return userRepository.save(user);
                })
                .orElseGet(() -> userRepository.save(TbUser.of( userId, name, email, null, FileStatus.PENDING, false)));
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
                                    FileStatus.PENDING,
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
        });
    }

    @Override
    public UserDto.UserProfileResDto findUserId(String userId) {
        TbUser user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found"));

        // 파일 키가 존재하면 Presigned URL 생성
        String profileImageUrl = null;
        if (StringUtils.hasText(user.getFileKey()) && FileStatus.UPLOADED.equals(user.getFileStatus())) {
            profileImageUrl = presignedUrlService
                    .generateDownloadUrl(user.getFileKey(), Duration.ofMinutes(60))
                    .toString();
        }

        return new UserDto.UserProfileResDto(
                user.getId(),
                user.getName(),
                user.getStudentId(),
                user.getEmail(),
                user.getPhone(),
                profileImageUrl
        );
    }

    @Override
    @Transactional
    public void updateUserProfileImage(UserDto.UserProfileImageReqDto reqDto, String userId) {
        userRepository.findById(userId).ifPresent(tbUser -> {
            tbUser.setFileKey(reqDto.getFileKey());
        });
    }

    @Override
    public UserDto.UserProfileLastResDto getLastUserByNodeGroup(String userId) {
        ArrayList<UserDto.LastProgramResDto> userProfileLastResDto
                = (ArrayList<UserDto.LastProgramResDto>) userMapper.findLastNodeGroupByCourseForUser(userId);
        return userProfileLastResDto.isEmpty() ? null : UserDto.UserProfileLastResDto.of(userProfileLastResDto);
    }

    @Override
    public List<ProgramDto.ResponseDto> getUserPrograms(String userId) {
        return programMapper.findProgramsByUserId(userId);
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
