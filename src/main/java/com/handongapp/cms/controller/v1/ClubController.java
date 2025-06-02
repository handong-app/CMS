package com.handongapp.cms.controller.v1;

import com.handongapp.cms.dto.v1.ClubDto;
import com.handongapp.cms.service.ClubService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("api/v1/clubs")
public class ClubController {

    private final ClubService clubService;

    public ClubController(ClubService clubService) {
        this.clubService = clubService;
    }

    @PostMapping
    public ResponseEntity<ClubDto.ClubProfileResDto> createClub(@RequestBody ClubDto.ClubProfileReqDto clubProfileReqDto) {
        ClubDto.ClubProfileResDto createdClub = clubService.createClub(clubProfileReqDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdClub);
    }

    @GetMapping("/{clubSlug}")
    public ResponseEntity<ClubDto.ClubProfileResDto> getClubProfile(@PathVariable String clubSlug) {
        ClubDto.ClubProfileResDto clubProfile = clubService.getClubProfile(clubSlug);
        return ResponseEntity.ok().body(clubProfile);
    }

    @PatchMapping("/{clubSlug}")
    public ResponseEntity<Map<String, String>> updateClubProfile(@PathVariable String clubSlug, @RequestBody ClubDto.ClubProfileReqDto clubProfileReqDto) {
        clubService.updateClubProfile(clubSlug, clubProfileReqDto);
        return ResponseEntity.ok().body(Collections.singletonMap("message", "클럽 '" + clubSlug + "'이(가) 성공적으로 수정되었습니다."));
    }

    @DeleteMapping("/{clubSlug}")
    public ResponseEntity<Map<String, String>> deleteClub(@PathVariable String clubSlug) {
        clubService.deleteClub(clubSlug);
        return ResponseEntity.ok().body(Collections.singletonMap("message", "클럽 '" + clubSlug + "'이(가) 성공적으로 삭제되었습니다."));
    }
}

