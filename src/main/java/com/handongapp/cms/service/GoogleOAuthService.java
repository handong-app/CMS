package com.handongapp.cms.service;

import com.handongapp.cms.security.dto.GoogleOAuthResponse;

public interface GoogleOAuthService {
    GoogleOAuthResponse authenticate(String authorizationCode);
    String refreshAccessToken(String refreshToken);
}
