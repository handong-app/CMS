package com.handongapp.cms.security;

import io.jsonwebtoken.Claims;

import java.util.Map;

public interface AuthService {

    String createAccessToken(Map<String, Object> claims, String subject);

    String createRefreshToken(String subject);

    boolean validateAccessToken(String token);

    boolean validateRefreshToken(String token);

    Claims getAccessClaims(String token);

    Claims getRefreshClaims(String token);

    String getSubjectFromAccess(String token);

    String getSubjectFromRefresh(String token);

    void saveRefreshToken(String refreshToken, String userId);

    boolean isValidRefreshToken(String userId, String providedToken);
}
