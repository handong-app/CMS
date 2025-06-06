package app.handong.cms.controller.v1;

import app.handong.cms.dto.v1.ProgramDto;
import app.handong.cms.dto.v1.UserDto;
import app.handong.cms.security.PrincipalDetails;
import app.handong.cms.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping("/programs")
    public ResponseEntity<List<ProgramDto.ResponseDto>> getUserPrograms(Authentication authentication) {
        PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();
        String userId = principalDetails.getUsername();

        List<ProgramDto.ResponseDto> resDto = tbUserService.getUserPrograms(userId);
        return ResponseEntity.ok(resDto);
    }

}

// 구현해야하는 기능 : access token에 beaer 붙여서 오도록