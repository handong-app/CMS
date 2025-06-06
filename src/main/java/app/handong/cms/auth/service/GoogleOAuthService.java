package app.handong.cms.auth.service;

import app.handong.cms.auth.dto.GoogleOAuthResponse;
import app.handong.cms.auth.dto.GoogleTokenResponse;
import app.handong.cms.auth.dto.GoogleUserInfoResponse;

public interface GoogleOAuthService {
    GoogleOAuthResponse authenticate(String authorizationCode);
    GoogleTokenResponse getAccessToken(String authorizationCode);
    String refreshAccessToken(String refreshToken);
    GoogleUserInfoResponse getUserInfo(String accessToken);

}
