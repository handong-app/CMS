package com.handongapp.cms.service.impl;

import com.handongapp.cms.domain.TbUser;
import com.handongapp.cms.repository.TbUserRepository;
import com.handongapp.cms.security.AuthService;
import com.handongapp.cms.security.LoginProperties;
import com.handongapp.cms.security.dto.GoogleOAuthResponse;
import com.handongapp.cms.security.dto.GooglePeopleResponse;
import com.handongapp.cms.security.dto.GoogleTokenResponse;
import com.handongapp.cms.security.dto.GoogleUserInfoResponse;
import com.handongapp.cms.service.GoogleOAuthService;
import com.handongapp.cms.service.TbUserService;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;           // Mono 연산자용
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class GoogleOAuthServiceImpl implements GoogleOAuthService {
    // 클래스 상단에 로거 선언
    private static final org.slf4j.Logger log =
            org.slf4j.LoggerFactory.getLogger(GoogleOAuthServiceImpl.class);

    private final WebClient webClient;
    private final LoginProperties loginProperties;
    private final TbUserService tbUserService;
    private final AuthService authService;
    private final TbUserRepository tbUserRepository;
    private final WebClient.Builder webClientBuilder;

    public GoogleOAuthServiceImpl(WebClient.Builder webClientBuilder,
                                  LoginProperties loginProperties,
                                  TbUserService tbUserService,
                                  AuthService authService,
                                  TbUserRepository tbUserRepository,
                                  WebClient.Builder webClientBuilder1) {
        this.webClient = webClientBuilder.build();
        this.loginProperties = loginProperties;
        this.tbUserService = tbUserService;
        this.authService = authService;
        this.tbUserRepository = tbUserRepository;
        this.webClientBuilder = webClientBuilder1;
    }

    @Override
    public GoogleOAuthResponse authenticate(String authorizationCode) {

        GoogleTokenResponse token = getAccessToken(authorizationCode);
        GoogleUserInfoResponse userInfo = getUserInfo(token.getAccessToken());
        TbUser tbUser = tbUserService.processGoogleUser(userInfo);

        updateStudentMeta(tbUser, getPeopleInfo(token.getAccessToken()));

        Map<String, Object> claims = buildClaims(tbUser);
        String access = authService.createAccessToken(claims, tbUser.getId());
        String refresh = authService.createRefreshToken(tbUser.getId());
        long expires = authService.getAccessClaims(access).getExpiration().getTime();

        authService.saveRefreshToken(refresh, tbUser.getId());

        return new GoogleOAuthResponse(access, refresh, expires, tbUser);
    }

    private void updateStudentMeta(TbUser tbUser, GooglePeopleResponse peopleInfo) {
        if (peopleInfo.getOrganizations() == null) {
            log.info("▶︎ People API 응답에 organizations가 없음");
            return;
        }

        peopleInfo.getOrganizations().stream()
                .filter(org -> "school".equalsIgnoreCase(org.getType()) && Boolean.TRUE.equals(org.getCurrent()))
                .findFirst()
                .ifPresent(school -> {
                    log.info("▶︎ 학교 조직 정보: title={}, department={}",
                            school.getTitle(), school.getDepartment());

                    // 학번 추출 예시 - title 에 학번이 들어 있다고 가정
                    String studentId = school.getTitle(); // ex) "20230123"

                    if (studentId != null && !studentId.isBlank()) {
                        tbUser.setStudentId(studentId);
                        tbUserRepository.save(tbUser);
                        log.info("▶︎ studentId 저장 완료: {}", studentId);
                    } else {
                        log.warn("▶︎ studentId가 비어 있음, 저장 생략");
                    }
                });
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
                        .with("grant_type", "authorization_code")
                )
                .retrieve()
                .bodyToMono(GoogleTokenResponse.class)
                .block();
    }


    public GooglePeopleResponse getPeopleInfo(String accessToken) {
        return webClientBuilder.build()
                .get()
                .uri(uriBuilder -> uriBuilder
                        .scheme("https")
                        .host("people.googleapis.com")
                        .path("/v1/people/me")
                        .queryParam("personFields", "organizations,metadata")
                        .build())
                .headers(h -> h.setBearerAuth(accessToken))
                .retrieve()                                   // ─┐ ResponseSpec
                .bodyToMono(GooglePeopleResponse.class)       // ─┘ Mono<GooglePeopleResponse>
                .doOnSubscribe(s -> log.info("▶︎ People API 호출"))
                .doOnError(e   -> log.error("▶︎ People API 오류", e))
                .doOnSuccess(p -> log.info("▶︎ People API 응답 {}", p))
                .block();                                     // 동기 반환
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