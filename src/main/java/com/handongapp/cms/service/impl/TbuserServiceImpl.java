package com.handongapp.cms.service.impl;

import com.handongapp.cms.domain.Tbuser;
import com.handongapp.cms.repository.TbuserRepository;
import com.handongapp.cms.security.dto.GoogleUserInfoResponse;
import com.handongapp.cms.service.TbuserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Objects;
import java.util.Optional;

@Service
public class TbuserServiceImpl implements TbuserService {

    private final TbuserRepository tbuserRepository;

    public TbuserServiceImpl(TbuserRepository tbuserRepository) {
        this.tbuserRepository = tbuserRepository;
    }

    public Tbuser saveOrUpdateUser(String userId, String email, String name) {
        // userId를 기준으로 사용자 검색
        Optional<Tbuser> existingUser = tbuserRepository.findByUserId(userId);

        if (existingUser.isPresent()) {
            // 기존 사용자 정보 업데이트
            Tbuser tbuser = existingUser.get();
            tbuser.setEmail(email);
            tbuser.setName(name);
            return tbuserRepository.save(tbuser);
        } else {
            // 새로운 사용자 저장
            Tbuser newUser = Tbuser.of(
                    userId,
                    name,
                    email,
                    null, // 기본 이미지 URL 설정 가능
                    Tbuser.UserRole.valueOf("USER") // 기본 역할 설정
            );
            return tbuserRepository.save(newUser);
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
    public Tbuser processGoogleUser(GoogleUserInfoResponse googleUserInfoResponse) {
        // 구글 userId를 기반으로 기존 회원 조회
        return tbuserRepository.findByUserId(googleUserInfoResponse.getId())
                .orElseGet(() -> {
                    // 없으면 새로 생성 및 저장
                    return tbuserRepository.save(Tbuser.of(
                            googleUserInfoResponse.getId(),
                            Objects.toString(googleUserInfoResponse.getFamily_name(), "")
                                    + Objects.toString(googleUserInfoResponse.getGiven_name(), ""),
                            googleUserInfoResponse.getEmail(),
                            googleUserInfoResponse.getPicture(),
                            Tbuser.UserRole.valueOf("USER")
                    ));
                });
    }
}
