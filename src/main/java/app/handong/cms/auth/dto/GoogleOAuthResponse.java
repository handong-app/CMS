package app.handong.cms.auth.dto;

import app.handong.cms.domain.TbUser;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Getter
public class GoogleOAuthResponse {
    private String accessToken;
    private String refreshToken;
    private long expiresIn;
    private TbUser member;
}