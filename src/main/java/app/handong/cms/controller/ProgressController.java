package app.handong.cms.controller;

import app.handong.cms.dto.ProgressDto;
import app.handong.cms.exception.auth.NoAuthenticatedException;
import app.handong.cms.security.PrincipalDetails;
import app.handong.cms.service.ProgressService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/progress")
public class ProgressController {

    private final ProgressService progressService;

    @PostMapping("/start")
    public ResponseEntity<ProgressDto.Response> startProgress(
            Authentication authentication, 
            @Valid @RequestBody ProgressDto.Request request) {
        
        log.info("노드그룹 학습 시작: nodeGroupId={}", request.getNodeGroupId());
        String userId = extractUserId(authentication);
        
        ProgressDto.Response response = progressService.startProgress(userId, request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/end")
    public ResponseEntity<ProgressDto.Response> endProgress(
            Authentication authentication, 
            @Valid @RequestBody ProgressDto.Request request) {
        
        log.info("노드그룹 학습 완료: nodeGroupId={}", request.getNodeGroupId());
        String userId = extractUserId(authentication);
        
        ProgressDto.Response response = progressService.endProgress(userId, request);
        return ResponseEntity.ok(response);
    }


    private String extractUserId(Authentication authentication) {
        if (authentication == null || authentication.getPrincipal() == null) {
            throw new NoAuthenticatedException("인증 정보가 없습니다");
        }
        if (!(authentication.getPrincipal() instanceof PrincipalDetails)) {
            throw new IllegalStateException("잘못된 인증 타입입니다");
        }
        PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();
        
        return principalDetails.getUsername();
    }
}
