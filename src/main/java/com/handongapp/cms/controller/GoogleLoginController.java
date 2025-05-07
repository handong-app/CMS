package com.handongapp.cms.controller;

import com.handongapp.cms.security.AuthService;
import com.handongapp.cms.security.LoginProperties;
import com.handongapp.cms.security.dto.GoogleOAuthResponse;
import com.handongapp.cms.service.GoogleOAuthService;
import com.handongapp.cms.service.TbuserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth/loginFormalMethod")
public class GoogleLoginController {

    private final TbuserService tbuserService;
    private final LoginProperties loginProperties;
    private final AuthService authService;
    private final GoogleOAuthService googleOAuthService;

    public GoogleLoginController(TbuserService tbuserService,
                                 LoginProperties loginProperties,
                                 AuthService authService,
                                 GoogleOAuthService googleOAuthService) {
        this.tbuserService = tbuserService;
        this.loginProperties = loginProperties;
        this.authService = authService;
        this.googleOAuthService = googleOAuthService;
    }

    /**
     * 구글 로그인에 사용될 Client ID 조회
     */
    @GetMapping("/client-id")
    public ResponseEntity<String> getClientId() {
        return ResponseEntity.ok(loginProperties.getClientId());
    }

    /**
     * 구글 로그인 콜백 (Authorization Code → Access Token 교환 → 사용자 정보 획득 → JWT 발급)
     */
    @GetMapping("/callback")
    public ResponseEntity<?> callback(@RequestParam("code") String authorizationCode) {
        GoogleOAuthResponse response = googleOAuthService.authenticate(authorizationCode);
        return ResponseEntity.ok(response);
    }

    /**
     * Refresh Token으로 새로운 Access Token 발급
     */
    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestHeader(value = "Refresh-Token", required = false) String refreshToken) {
        if (refreshToken == null || !refreshToken.startsWith("Bearer ")) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Missing or invalid refresh token header"));
        }

        String token = refreshToken.substring(7);
        String access = googleOAuthService.refreshAccessToken(token);
        return ResponseEntity.ok(Map.of("accessToken", access));
    }
}
