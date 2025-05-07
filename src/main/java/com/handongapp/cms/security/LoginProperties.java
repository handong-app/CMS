package com.handongapp.cms.security;

import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@Getter
@Setter
public class LoginProperties {

    @Value("${google.oauth.client-id}")
    private String clientId;
    @Value("${google.oauth.client-secret}")
    private String clientSecret;
    @Value("${google.oauth.redirect-uri}")
    private String redirectUri;

    @Value("${external.jwt.token.prefix}")
    private String jwtTokenPrefix;
    @Value("${external.jwt.token.access-token}")
    private String jwtAccessTokenPrefix;
    @Value("${external.jwt.token.refresh-token}")
    private String jwtRefreshTokenPrefix;
    @Value("${external.jwt.token.expiration}")
    private String jwtExpirationPrefix;

    @Value("${external.jwt.access.prefix}")
    private String accessTokenPrefix;
    @Value("${external.jwt.access.secret}")
    private String accessTokenSecret;
    @Value("${external.jwt.access.expiration-ms}")
    private long accessTokenExpirationMs;

    @Value("${external.jwt.refresh.prefix}")
    private String refreshTokenPrefix;
    @Value("${external.jwt.refresh.secret}")
    private String refreshTokenSecret;
    @Value("${external.jwt.refresh.expiration-ms}")
    private long refreshTokenExpirationMs;

}
