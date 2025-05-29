package com.handongapp.cms.auth.service;

import com.handongapp.cms.auth.dto.GoogleOAuthResponse;
import com.handongapp.cms.auth.dto.GoogleTokenResponse;
import com.handongapp.cms.auth.dto.GoogleUserInfoResponse;

public interface GoogleOAuthService {
    GoogleOAuthResponse authenticate(String authorizationCode);
    GoogleTokenResponse getAccessToken(String authorizationCode);
    String refreshAccessToken(String refreshToken);
    GoogleUserInfoResponse getUserInfo(String accessToken);

}
