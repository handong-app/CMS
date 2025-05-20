package com.handongapp.cms.security;

import com.github.benmanes.caffeine.cache.Cache;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import java.security.Key;
import java.time.Duration;
import java.util.Date;
import java.util.Map;
import java.util.UUID;

@Component
public class AuthServiceImpl implements AuthService{

    private final Logger logger = LoggerFactory.getLogger(this.getClass());
    private final LoginProperties loginProperties;
    private final Cache<String, String> refreshTokenCache;
    private final TokenBlacklistManager tokenBlacklistManager;
    private Key accessKeySecret;
    private Key refreshKeySecret;

    @PostConstruct
    private void init() {
        try {
            this.accessKeySecret = Keys.hmacShaKeyFor(loginProperties.getAccessTokenSecret().getBytes());
            this.refreshKeySecret = Keys.hmacShaKeyFor(loginProperties.getRefreshTokenSecret().getBytes());
        } catch (Exception e) {
            logger.error("JWT 키 초기화 중 오류 발생", e);
            throw new RuntimeException("JWT 토큰 키 초기화 실패", e);
        }
    }

    public AuthServiceImpl(LoginProperties loginProperties,
                           Cache<String, String> refreshTokenCache,
                           TokenBlacklistManager tokenBlacklistManager) {
        this.loginProperties = loginProperties;
        this.refreshTokenCache = refreshTokenCache;
        this.tokenBlacklistManager = tokenBlacklistManager;
    }

    public String createAccessToken(Map<String,Object> claims, String subject) {
        Date now    = new Date();
        Date expiry = new Date(now.getTime() + loginProperties.getAccessTokenExpirationMs());

        return Jwts.builder()
                .setClaims(claims)
                .setIssuer("app.handong.cms")
                .setAudience("app.handong.cms.frontend")
                .setSubject(subject)
                .setId(UUID.randomUUID().toString())
                .setIssuedAt(now)
                .setNotBefore(now)
                .setExpiration(expiry)
                .signWith(accessKeySecret, SignatureAlgorithm.HS512)
                .compact();
    }

    public String createRefreshToken(String subject) {
        Date now    = new Date();
        Date expiry = new Date(now.getTime() + loginProperties.getRefreshTokenExpirationMs());

        return Jwts.builder()
                .setSubject(subject)
                .setIssuer("app.handong.cms")
                .setAudience("app.handong.cms.frontend")
                .setId(UUID.randomUUID().toString())
                .setIssuedAt(now)
                .setNotBefore(now)
                .setExpiration(expiry)
                .signWith(refreshKeySecret, SignatureAlgorithm.HS512)
                .compact();
    }

    private Jws<Claims> parseToken(String token, Key key) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token);
    }

    public boolean validateAccessToken(String token) {
        try {
            parseToken(token, accessKeySecret);

            if (tokenBlacklistManager.isBlacklisted(token)) {
                logger.debug("토큰이 블랙리스트에 있습니다: {}", token);
                return false;
            }

            return true;
        } catch (JwtException | IllegalArgumentException e) {
            logger.debug("Access 토큰 검증 실패: {}", e.getMessage());
            return false;
        }
    }

    public boolean validateRefreshToken(String token) {
        try {
            parseToken(token, refreshKeySecret);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            logger.debug("Refresh 토큰 검증 실패: {}", e.getMessage());
            return false;
        }
    }

    public Claims getAccessClaims(String token) {
        try {
            return parseToken(token, accessKeySecret).getBody();
        } catch (JwtException | IllegalArgumentException e) {
            logger.error("Access 토큰에서 Claims 추출 실패: {}", e.getMessage());
            throw new RuntimeException("유효하지 않은 Access 토큰입니다", e);
        }
    }

    public Claims getRefreshClaims(String token) {
        try {
            return parseToken(token, refreshKeySecret).getBody();
        } catch (JwtException | IllegalArgumentException e) {
            logger.error("Refresh 토큰에서 Claims 추출 실패: {}", e.getMessage());
            throw new RuntimeException("유효하지 않은 Refresh 토큰입니다", e);
        }
    }

    public String getSubjectFromAccess(String token) {
        try {
            return getAccessClaims(token).getSubject();
        } catch (RuntimeException e) {
            logger.error("Access 토큰에서 Subject 추출 실패: {}", e.getMessage());
            throw new RuntimeException("Access 토큰에서 Subject를 추출할 수 없습니다", e);
        }
    }

    public String getSubjectFromRefresh(String token) {
        try {
            return getRefreshClaims(token).getSubject();
        } catch (RuntimeException e) {
            logger.error("Refresh 토큰에서 Subject 추출 실패: {}", e.getMessage());
            throw new RuntimeException("Refresg 토큰에서 Subject를 추출할 수 없습니다", e);
        }
    }

    @Override
    public void saveRefreshToken(String refreshToken, String email) {
        refreshTokenCache.put("refresh:" + email, refreshToken);
        refreshTokenCache.policy().expireVariably().ifPresent(policy ->
                policy.put("refresh:" + email, refreshToken, Duration.ofMillis(loginProperties.getRefreshTokenExpirationMs()))
        );
    }

    @Override
    public boolean isValidRefreshToken(String email, String providedToken) {
        String stored = refreshTokenCache.getIfPresent("refresh:" + email);
        return stored != null && stored.equals(providedToken);
    }
}
