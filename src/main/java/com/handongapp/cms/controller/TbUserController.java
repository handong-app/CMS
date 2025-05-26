package com.handongapp.cms.controller;

import com.handongapp.cms.dto.TbUserDto;
import com.handongapp.cms.service.TbUserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
public class TbUserController {

    private final TbUserService tbUserService;

    public TbUserController(TbUserService tbUserService) {
        this.tbUserService = tbUserService;
    }

    @PatchMapping("/profile")
    public ResponseEntity<Void> updateProfile(@RequestBody TbUserDto.UpdateUserProfileReqDto reqDto) {
        tbUserService.updateUserProfile(reqDto);
        return ResponseEntity.noContent().build();
    }


}
