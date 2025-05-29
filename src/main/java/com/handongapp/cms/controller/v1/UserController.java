package com.handongapp.cms.controller.v1;

import com.handongapp.cms.dto.v1.UserDto;
import com.handongapp.cms.security.PrincipalDetails;
import com.handongapp.cms.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/user")
public class UserController {

    private final UserService tbUserService;

    public UserController(UserService tbUserService) {
        this.tbUserService = tbUserService;
    }

    @PatchMapping("/profile")
    public ResponseEntity<Void> updateProfile(@RequestBody UserDto.UserProfileReqDto reqDto,
                                              Authentication authentication) {
        PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();
        String userId = principalDetails.getUsername();

        tbUserService.updateUserProfile(reqDto, userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/profile")
    public ResponseEntity<UserDto.UserProfileResDto> getUserProfile(Authentication authentication) {
        PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();
        String userId = principalDetails.getUsername();
        return ResponseEntity.ok(tbUserService.findUserId(userId));
    }

    @PostMapping("/image")
    public ResponseEntity<Void> updateUserProfileImage(@RequestBody UserDto.UserProfileImageReqDto reqDto,
                                              Authentication authentication) {
        PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();
        String userId = principalDetails.getUsername();

        tbUserService.updateUserProfileImage(reqDto, userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/profile/last")
    public ResponseEntity<UserDto.UserProfileLastResDto> getLastUser(Authentication authentication) {
        PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();
        String userId = principalDetails.getUsername();

        UserDto.UserProfileLastResDto resDto = tbUserService.getLastUserByNodeGroup(userId);
        return resDto != null ? ResponseEntity.ok(resDto) : ResponseEntity.ok(new UserDto.UserProfileLastResDto());
    }

}
