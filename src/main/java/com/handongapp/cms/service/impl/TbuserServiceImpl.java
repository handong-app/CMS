package com.handongapp.cms.service.impl;

import com.handongapp.cms.domain.TbClubRole;
import com.handongapp.cms.domain.TbUser;
import com.handongapp.cms.domain.enums.ClubUserRole;
import com.handongapp.cms.domain.enums.ProgramProgressState;
import com.handongapp.cms.repository.TbClubRoleRepository;
import com.handongapp.cms.repository.TbUserRepository;
import com.handongapp.cms.security.dto.GoogleUserInfoResponse;
import com.handongapp.cms.service.TbuserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.naming.NoPermissionException;
import java.util.Objects;
import java.util.Optional;

@Service
public class TbuserServiceImpl implements TbuserService {

    private final TbUserRepository tbUserRepository;
    private final TbClubRoleRepository tbClubRoleRepository;

    public TbuserServiceImpl(TbUserRepository tbUserRepository,
                             TbClubRoleRepository tbClubRoleRepository) {
        this.tbUserRepository = tbUserRepository;
        this.tbClubRoleRepository = tbClubRoleRepository;
    }

    public TbUser saveOrUpdateUser(String userId, String email, String name) {
        // userId를 기준으로 사용자 검색
        Optional<TbUser> existingUser = tbUserRepository.findById(userId);

        if (existingUser.isPresent()) {
            // 기존 사용자 정보 업데이트
            TbUser tbuser = existingUser.get();
            tbuser.setEmail(email);
            tbuser.setName(name);
            return tbUserRepository.save(tbuser);
        } else {
            // 새로운 사용자 저장
            TbUser newUser = TbUser.of(
                    userId,
                    name,
                    email,
                    null, // 기본 이미지 URL 설정 가능
                    false
            );
            return tbUserRepository.save(newUser);
        }
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
        return tbUserRepository.findById(googleUserInfoResponse.getId())
                .orElseGet(() -> {
                    String allowedDomain = "handong.ac.kr";
                    if (!googleUserInfoResponse.getEmail().toLowerCase().endsWith("@" + allowedDomain)) {
                        try {
                            throw new NoPermissionException("학교 계정이 아니면 회원가입할 수 없습니다.");
                        } catch (NoPermissionException e) {
                            throw new RuntimeException(e);
                        }
                    }

                    TbClubRole.of(ClubUserRole.USER, "막 가입한 학생");

                    return tbUserRepository.save(
                            TbUser.of(
                                    googleUserInfoResponse.getId(),
                                    Objects.toString(googleUserInfoResponse.getFamilyName(), "")
                                            + Objects.toString(googleUserInfoResponse.getGivenName(), ""),
                                    googleUserInfoResponse.getEmail(),
                                    googleUserInfoResponse.getPicture(),
                                    false
                            )
                    );
                });
    }
}
