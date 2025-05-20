package com.handongapp.cms.controller;

import com.handongapp.cms.security.AuthService;
import com.handongapp.cms.security.LoginProperties;
import com.handongapp.cms.security.TokenBlacklistManager;
import com.handongapp.cms.security.dto.GoogleOAuthResponse;
import com.handongapp.cms.service.GoogleOAuthService;
import com.handongapp.cms.service.TbuserService;
import io.jsonwebtoken.io.IOException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth/google")
public class GoogleLoginController {

    private final TbuserService tbuserService;
    private final LoginProperties loginProperties;
    private final AuthService authService;
    private final GoogleOAuthService googleOAuthService;
    private final TokenBlacklistManager tokenBlacklistManager;

    public GoogleLoginController(TbuserService tbuserService,
                                 LoginProperties loginProperties,
                                 AuthService authService,
                                 GoogleOAuthService googleOAuthService,
                                 TokenBlacklistManager tokenBlacklistManager) {
        this.tbuserService = tbuserService;
        this.loginProperties = loginProperties;
        this.authService = authService;
        this.googleOAuthService = googleOAuthService;
        this.tokenBlacklistManager = tokenBlacklistManager;
    }

    /**
     * 구글 로그인에 사용될 Client ID 조회
     */
    @GetMapping("/client-id")
    public ResponseEntity<String> getClientId() {
        return ResponseEntity.ok(loginProperties.getClientId());
    }

    /**
     + Google login callback (Authorization Code → Access Token exchange → User info retrieval → JWT issuance)
     */
    @GetMapping("/callback")
    public ResponseEntity<?> callback(@RequestParam("code") String authorizationCode) {
        try {
            if (authorizationCode == null || authorizationCode.trim().isEmpty())
                return ResponseEntity.badRequest().body(Map.of("error", "Authorization code not provided"));

            GoogleOAuthResponse response = googleOAuthService.authenticate(authorizationCode);
            return ResponseEntity.ok(response);

        }
        catch (IOException e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error communicating with Google: " + e.getMessage()));
        }
        catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Authentication error: " + e.getMessage()));
        }
    }

    /**
     * Refresh Token으로 새로운 Access Token 발급
     */
    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestHeader(value = "Refresh-Token", required = false) String refreshToken) {
        if (refreshToken == null || !refreshToken.startsWith("Bearer "))
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Missing or invalid refresh token header"));

        String token = refreshToken.substring(7);

        try {
            String access = googleOAuthService.refreshAccessToken(token);
            if (access == null || access.isEmpty())
                return ResponseEntity.status(401).body(Map.of("error", "Invalid or expired refresh token"));
            return ResponseEntity.ok(Map.of("accessToken", access));

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Token refresh failed: " + e.getMessage()));
        }
    }

    /**
     * Process logout by blacklisting the access token
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String accessToken) {
        if (accessToken == null || !accessToken.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().body(Map.of("error", "토큰이 올바르지 않습니다."));
        }
        String token = accessToken.substring(loginProperties.getJwtTokenPrefix().length());

        tokenBlacklistManager.blacklist(token);

        return ResponseEntity.ok(Map.of("message", "로그아웃 성공"));
    }

}
