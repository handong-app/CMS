package com.handongapp.cms.security.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class GoogleUserInfoResponse {
    private String id;       // 구글 고유 아이디
    @JsonProperty("verified_email") private boolean verifiedEmail;
    private String email;    // 구글 이메일
    @JsonProperty("given_name")  private String givenName;
    @JsonProperty("family_name")  private String familyName;
    private String picture;
    private String locale;
}
