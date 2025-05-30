package com.handongapp.cms.controller.v1;

import com.handongapp.cms.dto.v1.ClubDto;
import com.handongapp.cms.service.ClubService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/clubs/{clubSlug}")
public class ClubController {

    private final ClubService clubService;

    public ClubController(ClubService clubService) {
        this.clubService = clubService;
    }

    @GetMapping()
    public ResponseEntity<?> getClubProfile(@PathVariable String clubSlug) {
        ClubDto.ClubProfileResDto clubProfile = clubService.getClubProfile(clubSlug);
        if (clubProfile == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().body(clubProfile);
    }

    @PatchMapping()
    public ResponseEntity<?> updateClubProfile(@PathVariable String clubSlug, @RequestBody ClubDto.ClubProfileReqDto clubProfileResDto) {
        clubService.updateClubProfile(clubSlug, clubProfileResDto);
        return ResponseEntity.noContent().build();
    }   

}

