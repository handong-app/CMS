package com.handongapp.cms.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.security.Key;
import java.util.Date;
import java.util.Map;
import java.util.UUID;

@Component
public class AuthServiceImpl implements AuthService{

    private final LoginProperties loginProperties;
    private Key accessKeySecret;
    private Key refreshKeySecret;

    @PostConstruct
    private void init() {
        this.accessKeySecret  = Keys.hmacShaKeyFor(loginProperties.getAccessTokenSecret().getBytes());
        this.refreshKeySecret = Keys.hmacShaKeyFor(loginProperties.getRefreshTokenSecret().getBytes());
    }

    public AuthServiceImpl(LoginProperties loginProperties) {
        this.loginProperties = loginProperties;
    }

    public String createAccessToken(Map<String,Object> claims, String subject) {
        Date now    = new Date();
        Date expiry = new Date(now.getTime() + loginProperties.getAccessTokenExpirationMs());

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setId(UUID.randomUUID().toString())
                .setIssuedAt(now)
                .setExpiration(expiry)
                .signWith(accessKeySecret, SignatureAlgorithm.HS512)
                .compact();
    }

    public String createRefreshToken(String subject) {
        Date now    = new Date();
        Date expiry = new Date(now.getTime() + loginProperties.getRefreshTokenExpirationMs());

        return Jwts.builder()
                .setSubject(subject)
                .setId(UUID.randomUUID().toString())
                .setIssuedAt(now)
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
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public boolean validateRefreshToken(String token) {
        try {
            parseToken(token, refreshKeySecret);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public Claims getAccessClaims(String token) {
        return parseToken(token, accessKeySecret).getBody();
    }

    public Claims getRefreshClaims(String token) {
        return parseToken(token, refreshKeySecret).getBody();
    }

    public String getSubjectFromAccess(String token) {
        return getAccessClaims(token).getSubject();
    }

    public String getSubjectFromRefresh(String token) {
        return getRefreshClaims(token).getSubject();
    }
}
