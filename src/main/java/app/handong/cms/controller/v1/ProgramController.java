package app.handong.cms.controller.v1;

import app.handong.cms.service.ProgramService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import app.handong.cms.dto.v1.ProgramDto;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/clubs/{clubSlug}/programs")
@RequiredArgsConstructor
public class ProgramController {

    private final ProgramService programService;

    @PostMapping
    public ResponseEntity<ProgramDto.ResponseDto> createProgram(
            @PathVariable String clubSlug,
            @Valid @RequestBody ProgramDto.CreateRequest requestDto,
            Authentication authentication) {
        ProgramDto.ResponseDto createdProgram = programService.createProgram(clubSlug, requestDto, authentication);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdProgram);
    }

    @GetMapping
    public ResponseEntity<String> getProgramsByClubSlug(@PathVariable String clubSlug, Authentication authentication) {
        String currentUserId = (authentication != null) ? authentication.getName() : null;
        String programsJson = programService.getProgramsWithCoursesByClubSlugAsJson(clubSlug, currentUserId);
        final HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setContentType(MediaType.APPLICATION_JSON);
        return new ResponseEntity<>(programsJson, httpHeaders, HttpStatus.OK);
    }

    @GetMapping("/{programSlug}")
    public ResponseEntity<String> getProgramDetailsBySlug(
            @PathVariable String clubSlug,
            @PathVariable String programSlug) {
        String programDetailsJson = programService.getProgramDetailsWithCoursesAsJson(clubSlug, programSlug);
        final HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setContentType(MediaType.APPLICATION_JSON);
        return new ResponseEntity<>(programDetailsJson, httpHeaders, HttpStatus.OK);
    }

    @GetMapping("/{programSlug}/users")
    public ResponseEntity<String> getProgramParticipantProgress(
            @PathVariable String clubSlug,
            @PathVariable String programSlug) {
        String progressJson = programService.getProgramParticipantProgressAsJson(clubSlug, programSlug);
        final HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setContentType(MediaType.APPLICATION_JSON);
        return new ResponseEntity<>(progressJson, httpHeaders, HttpStatus.OK);
    }

    @PostMapping("/{programSlug}/join")
    public ResponseEntity<Void> joinProgram(
            @PathVariable String clubSlug,
            @PathVariable String programSlug,
            Authentication authentication) { // ProgramJoinRequestDto는 현재 비어있으므로 @RequestBody 생략
        programService.joinProgram(clubSlug, programSlug, authentication);
        return ResponseEntity.status(HttpStatus.CREATED).build(); // 성공 시 201 CREATED 반환
    }

    @PostMapping("/{programSlug}/add-course/{courseSlug}")
    public ResponseEntity<Void> addCourseToProgram(
            @PathVariable String clubSlug,
            @PathVariable String programSlug,
            @PathVariable String courseSlug,
            Authentication authentication) {
        programService.addCourseToProgram(clubSlug, programSlug, courseSlug, authentication);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

}
