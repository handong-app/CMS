package com.handongapp.cms.auth.dto;

import com.handongapp.cms.domain.TbUser;
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