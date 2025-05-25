package com.handongapp.cms.security.dto;

import com.handongapp.cms.domain.Tbuser;
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
    private Tbuser member;
}