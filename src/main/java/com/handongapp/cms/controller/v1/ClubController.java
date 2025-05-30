package com.handongapp.cms.controller.v1;

import com.handongapp.cms.dto.v1.ClubDto;
import com.handongapp.cms.service.ClubService;
import com.handongapp.cms.service.CourseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/clubs/{clubName}")
public class ClubController {

    private final ClubService clubService;

    public ClubController(ClubService clubService) {
        this.clubService = clubService;
    }

    @GetMapping()
    public ResponseEntity<?> getClubProfile(@PathVariable String clubName) {
        return ResponseEntity.ok().body(clubService.getClubProfile(clubName));
    }

    @PatchMapping()
    public ResponseEntity<?> updateClubProfile(@PathVariable String clubName, @RequestBody ClubDto.ClubProfileReqDto clubProfileResDto) {
        clubService.updateClubProfile(clubName, clubProfileResDto);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/courses/{courseName}")
    public ResponseEntity<?>getCourseInfo(@PathVariable String clubName, @PathVariable String courseName) {
        ClubDto.ClubCourseInfoResDto clubCourseInfoResDto = clubService.getCourseInfo(clubName, courseName);
        return ResponseEntity.ok().body(clubCourseInfoResDto);
    }
}

