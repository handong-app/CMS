package com.handongapp.cms.security.dto;

import com.handongapp.cms.domain.Tbuser;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class GoogleOAuthResponse {
    String accessToken;
    String refreshToken;
    long expiresIn;
    Tbuser member;
}