package com.handongapp.cms.controller;

import com.handongapp.cms.dto.TbUserDto;
import com.handongapp.cms.security.PrincipalDetails;
import com.handongapp.cms.service.TbUserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/user")
public class TbUserController {

    private final TbUserService tbUserService;

    public TbUserController(TbUserService tbUserService) {
        this.tbUserService = tbUserService;
    }

    @PatchMapping("/profile")
    public ResponseEntity<Void> updateProfile(@RequestBody TbUserDto.UserProfileReqDto reqDto,
                                              Authentication authentication) {
        PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();
        String userId = principalDetails.getUsername();

        tbUserService.updateUserProfile(reqDto, userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/profile")
    public ResponseEntity<TbUserDto.UserProfileResDto> getUserProfile(Authentication authentication) {
        PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();
        String userId = principalDetails.getUsername();

        Optional<TbUserDto.UserProfileResDto> resDto = tbUserService.findUserId(userId);

        return resDto
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

}
