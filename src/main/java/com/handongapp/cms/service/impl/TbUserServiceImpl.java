package com.handongapp.cms.service.impl;

import com.handongapp.cms.domain.TbClubRole;
import com.handongapp.cms.domain.TbUser;
import com.handongapp.cms.domain.TbUserClubRole;
import com.handongapp.cms.repository.TbUserClubRoleRepository;
import com.handongapp.cms.repository.TbUserRepository;
import com.handongapp.cms.security.dto.GoogleUserInfoResponse;
import com.handongapp.cms.service.TbUserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Objects;

@Service
public class TbUserServiceImpl implements TbUserService {

    private final TbUserRepository tbUserRepository;
    private final TbUserClubRoleRepository tbUserClubRoleRepository;

    public TbUserServiceImpl(TbUserRepository tbUserRepository,
                             TbUserClubRoleRepository tbUserClubRoleRepository) {
        this.tbUserRepository = tbUserRepository;
        this.tbUserClubRoleRepository = tbUserClubRoleRepository;
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
