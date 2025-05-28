package com.handongapp.cms.controller;

import com.handongapp.cms.dto.TbClubDto;
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
    public ResponseEntity<?> updateClubProfile(@PathVariable String clubName, @RequestBody TbClubDto.ClubProfileReqDto clubProfileResDto) {
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

    // 이거까지는 내가!
    @GetMapping("/courses")
    public ResponseEntity<?> getCoursesList(@PathVariable String clubName ,@RequestParam String programId) {
        List<TbClubDto.ClubCourseListResDto> courseList = courseService.getCourseList(clubName, programId);
        return ResponseEntity.ok(courseList);
    }
    // tb_program_progress의 program_id , tb_program_couse_의 program_id
    // course id랑


    @GetMapping("/courses/{courseName}")
    public ResponseEntity<?>getCourseInfo(@PathVariable String clubName, @PathVariable String courseName) {
        TbClubDto.ClubCourseInfoResDto clubCourseInfoResDto = clubService.getCourseInfo(clubName, courseName);
        return ResponseEntity.ok().body(clubCourseInfoResDto);
    }
    // 코스 제목, 제작자, 코스 설명, 코스 대표 이미지 주소
    // 코스 댓글 카테고리 목록 > 카테고리 정보 (코스별로 pre define)
    // > 카테고리 이름, slug, emoji, ..

}

//동아리의 프로그램 목록 개발 > 프로그램 정보 배열 필요
//프로그램 정보 api > 프로그램 이름, 프로그램 설명, 코스목록 api의 필터링과 사용
//프로그램 정보 > 코스 목록 api 필요
//코스 목록 api  > 코스 정보 api 필요 + filtering
//코스 정보 api 개발 시작