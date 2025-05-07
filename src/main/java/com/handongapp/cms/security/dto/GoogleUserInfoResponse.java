package com.handongapp.cms.security.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class GoogleUserInfoResponse {
    private String id;       // 구글 고유 아이디
    private String verified_email;
    private String email;    // 구글 이메일
    private String given_name;
    private String family_name;
    private String picture;
    private String locale;
}
