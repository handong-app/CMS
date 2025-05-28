package com.handongapp.cms.auth.service;

import com.handongapp.cms.auth.dto.GoogleOAuthResponse;

public interface GoogleOAuthService {
    GoogleOAuthResponse authenticate(String authorizationCode);
    String refreshAccessToken(String refreshToken);
}
