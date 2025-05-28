package com.handongapp.cms.controller.v1;

import com.handongapp.cms.dto.v1.ClubDto;
import com.handongapp.cms.service.ClubService;
import com.handongapp.cms.service.CourseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/clubs/{clubName}")
public class ClubController {

    private final ClubService clubService;
    private final CourseService courseService;

    public ClubController(ClubService clubService,
                          CourseService courseService) {
        this.clubService = clubService;
        this.courseService = courseService;
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

    @GetMapping("/programs")
    public ResponseEntity<?> getProgramsList(@PathVariable String clubName) {
        clubService.getAllProgramsList(clubName);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/programs/{programName}")
    public ResponseEntity<?> getProgramInfo(@PathVariable String clubName, @PathVariable String programName) {
        clubService.getProgramInfo(clubName, programName);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/courses")
    public ResponseEntity<?> getCoursesList(@PathVariable String clubName ,@RequestParam String programId) {
        List<ClubDto.ClubCourseListResDto> courseList = courseService.getCourseList(clubName, programId);
        return ResponseEntity.ok(courseList);
    }

    @GetMapping("/courses/{courseName}")
    public ResponseEntity<?>getCourseInfo(@PathVariable String clubName, @PathVariable String courseName) {
        ClubDto.ClubCourseInfoResDto clubCourseInfoResDto = clubService.getCourseInfo(clubName, courseName);
        return ResponseEntity.ok().body(clubCourseInfoResDto);
    }
}

