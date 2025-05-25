package com.handongapp.cms.service.impl;

import com.handongapp.cms.domain.TbUser;
import com.handongapp.cms.repository.TbUserRepository;
import com.handongapp.cms.security.AuthService;
import com.handongapp.cms.security.LoginProperties;
import com.handongapp.cms.security.dto.GoogleOAuthResponse;
import com.handongapp.cms.security.dto.GoogleTokenResponse;
import com.handongapp.cms.security.dto.GoogleUserInfoResponse;
import com.handongapp.cms.service.GoogleOAuthService;
import com.handongapp.cms.service.TbuserService;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class GoogleOAuthServiceImpl implements GoogleOAuthService {

    private final WebClient webClient;
    private final LoginProperties loginProperties;
    private final TbuserService tbuserService;
    private final AuthService authService;
    private final TbUserRepository tbuserRepository;

    public GoogleOAuthServiceImpl(WebClient.Builder webClientBuilder,
                                  LoginProperties loginProperties,
                                  TbuserService tbuserService,
                                  AuthService authService,
                                  TbUserRepository tbuserRepository) {
        this.webClient = webClientBuilder.build();
        this.loginProperties = loginProperties;
        this.tbuserService = tbuserService;
        this.authService = authService;
        this.tbuserRepository = tbuserRepository;
    }

    @Override
    public GoogleOAuthResponse authenticate(String authorizationCode) {
        // 1. Authorization Code → Access Token 교환
        GoogleTokenResponse token = webClient.post()
                .uri("https://oauth2.googleapis.com/token")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(BodyInserters.fromFormData("code", authorizationCode)
                        .with("client_id", loginProperties.getClientId())
                        .with("client_secret", loginProperties.getClientSecret())
                        .with("redirect_uri", loginProperties.getRedirectUri())
                        .with("grant_type", "authorization_code"))
                .retrieve()
                .bodyToMono(GoogleTokenResponse.class)
                .block();

        // 2. Access Token → Google 사용자 정보 조회
        GoogleUserInfoResponse userInfo = webClient.get()
                .uri("https://www.googleapis.com/oauth2/v2/userinfo")
                .header("Authorization", "Bearer " + token.getAccessToken())
                .retrieve()
                .bodyToMono(GoogleUserInfoResponse.class)
                .block();

        // 3. Member 가입/로그인 처리
        TbUser tbuser = tbuserService.processGoogleUser(userInfo);

        // 4. JWT claims 생성
        Map<String, Object> claims = buildClaims(tbuser);

        String access = authService.createAccessToken(claims, tbuser.getId());
        String refresh = authService.createRefreshToken(tbuser.getId());
        long expires = authService.getAccessClaims(access).getExpiration().getTime();

        authService.saveRefreshToken(refresh, tbuser.getId());

        return new GoogleOAuthResponse(access, refresh, expires, tbuser);
    }

    @Override
    public String refreshAccessToken(String refreshToken) {
        if (!authService.validateRefreshToken(refreshToken)) {
            throw new IllegalArgumentException("Invalid refresh token");
        }
        String rawSubject = authService.getSubjectFromRefresh(refreshToken);
        String userId = rawSubject.replaceFirst("user-", "");

        if (!authService.isValidRefreshToken(userId, refreshToken)) {
            throw new IllegalArgumentException("Refresh Token is not recognized or reused.");
        }

        Optional<TbUser> userOpt = tbuserRepository.findById(userId);
        if (userOpt.isPresent()) {
            TbUser tbuser = userOpt.get();
            Map<String, Object> claims = buildClaims(tbuser);
            return authService.createAccessToken(claims, userOpt.get().getId());
        }
        return authService.createAccessToken(Map.of(),  userOpt.get().getId());
    }

    private Map<String, Object> buildClaims(TbUser tbuser) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("email", Optional.ofNullable(tbuser.getEmail()).orElse(""));
        claims.put("name", Optional.ofNullable(tbuser.getName()).orElse(""));
        claims.put("role", Optional.ofNullable("USER"))/*, tbuser.getRole())
                .map(Enum::name)
                .orElse("USER"))*/;
        claims.put("student", Optional.ofNullable(tbuser.getStudentId()).orElse(""));
        return claims;
    }

}