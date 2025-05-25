package com.handongapp.cms.service.impl;

import com.handongapp.cms.domain.TbUser;
import com.handongapp.cms.repository.TbUserRepository;
import com.handongapp.cms.security.AuthService;
import com.handongapp.cms.security.LoginProperties;
import com.handongapp.cms.security.dto.GoogleOAuthResponse;
import com.handongapp.cms.security.dto.GoogleTokenResponse;
import com.handongapp.cms.security.dto.GoogleUserInfoResponse;
import com.handongapp.cms.service.GoogleOAuthService;
import com.handongapp.cms.service.TbUserService;
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
    private final TbUserService tbUserService;
    private final AuthService authService;
    private final TbUserRepository tbUserRepository;

    public GoogleOAuthServiceImpl(WebClient.Builder webClientBuilder,
                                  LoginProperties loginProperties,
                                  TbUserService tbUserService,
                                  AuthService authService,
                                  TbUserRepository tbUserRepository) {
        this.webClient = webClientBuilder.build();
        this.loginProperties = loginProperties;
        this.tbUserService = tbUserService;
        this.authService = authService;
        this.tbUserRepository = tbUserRepository;
    }

    @Override
    public GoogleOAuthResponse authenticate(String authorizationCode) {

        GoogleTokenResponse token = getAccessToken(authorizationCode);
        GoogleUserInfoResponse userInfo = getUserInfo(token.getAccessToken());
        TbUser tbUser = tbUserService.processGoogleUser(userInfo);

        Map<String, Object> claims = buildClaims(tbUser);
        String access = authService.createAccessToken(claims, tbUser.getId());
        String refresh = authService.createRefreshToken(tbUser.getId());
        long expires = authService.getAccessClaims(access).getExpiration().getTime();

        authService.saveRefreshToken(refresh, tbUser.getId());

        return new GoogleOAuthResponse(access, refresh, expires, tbUser);
    }


    GoogleTokenResponse getAccessToken(String authorizationCode) {
        return webClient.post()
                .uri("https://oauth2.googleapis.com/token")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .header("Host", "oauth2.googleapis.com")  // 명시적 Host 헤더 추가
                .body(BodyInserters.fromFormData("code", authorizationCode)
                        .with("client_id", loginProperties.getClientId())
                        .with("client_secret", loginProperties.getClientSecret())
                        .with("redirect_uri", loginProperties.getRedirectUri())
                        .with("grant_type", "authorization_code"))
                .retrieve()
                .bodyToMono(GoogleTokenResponse.class)
                .block();
    }

    public GoogleUserInfoResponse getUserInfo(String accessToken) {
        return webClient.get()
                .uri("https://www.googleapis.com/oauth2/v2/userinfo")
                .header("Authorization", "Bearer " + accessToken)
                .retrieve()
                .bodyToMono(GoogleUserInfoResponse.class)
                .block();
    }

    private Map<String, Object> buildClaims(TbUser tbUser) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("email", Optional.ofNullable(tbUser.getEmail()).orElse(""));
        claims.put("name", Optional.ofNullable(tbUser.getName()).orElse(""));
        claims.put("role", "USER");  // 로그인 하자마자는 USER로..?
        claims.put("studentId", Optional.ofNullable(tbUser.getStudentId()).orElse(""));
        return claims;
    }

    @Override
    public String refreshAccessToken(String refreshToken) {
        validateRefreshToken(refreshToken);

        String userId = extractUserId(refreshToken);
        ensureTokenMatchesCache(userId, refreshToken);

        TbUser user = tbUserRepository.findById(userId)
                .orElse(null);

        Map<String, Object> claims = (user != null) ? buildClaims(user) : Map.of();
        return authService.createAccessToken(claims, userId);
    }

    private void validateRefreshToken(String token) {
        if (!authService.validateRefreshToken(token)) {
            throw new InvalidTokenException("리프레시 토큰 형식이 유효하지 않습니다.");
        }
    }

    private String extractUserId(String refreshToken) {
        return authService.getSubjectFromRefresh(refreshToken)
                .replaceFirst("^user-", "");
    }

    private void ensureTokenMatchesCache(String userId, String suppliedToken) {
        if (!authService.isValidRefreshToken(userId, suppliedToken)) {
            throw new TokenReuseException("재사용되었거나 서버에 없는 리프레시 토큰입니다.");
        }
    }

    public static class InvalidTokenException extends RuntimeException {
        public InvalidTokenException(String message) { super(message); }
    }

    public static class TokenReuseException extends RuntimeException {
        public TokenReuseException(String message) { super(message); }
    }
}