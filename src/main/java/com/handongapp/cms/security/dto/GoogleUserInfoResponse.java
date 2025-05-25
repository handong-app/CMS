package com.handongapp.cms.security.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class GoogleUserInfoResponse {
    // 학생 계정 사용하면, 구글 로그인할 경우, 구글에서 보내줘. metadata에서 학번 가져오는 거로.
    // 한동대 계정으로만 로그인 하도록.
    // student id로 바꾸기 (access token 바꾸기)
    private String id;       // 구글 고유 아이디
    @JsonProperty("verified_email") private boolean verifiedEmail;
    private String email;    // 구글 이메일
    @JsonProperty("given_name")  private String givenName;
    @JsonProperty("family_name")  private String familyName;
    private String picture;
    private String locale;
}
