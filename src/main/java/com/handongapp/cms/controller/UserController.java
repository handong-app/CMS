package com.handongapp.cms.controller;


import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {

    // 방법 1: Authentication 객체에서 정보 추출
    @GetMapping("/me")
    public Map<String, Object> getMyInfo(Authentication authentication) {
        String username = authentication.getName(); // email로 JWT subject 설정되어 있을 경우
        return Map.of(
                "message", "인증된 사용자 정보입니다",
                "email", username
        );
    }
}
