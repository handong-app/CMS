package com.handongapp.cms.controller.v1;

import com.handongapp.cms.service.ProgramService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/clubs/{clubSlug}/programs")
@RequiredArgsConstructor
public class ProgramController {

    private final ProgramService programService;

    @GetMapping
    public ResponseEntity<String> getProgramsByClubSlug(@PathVariable String clubSlug) {
        String programsJson = programService.getProgramsWithCoursesByClubSlugAsJson(clubSlug);
        if (isEmptyJsonResult(programsJson)) { // 결과가 없거나 빈 배열일 경우
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("{\"message\": \"No programs found for this club.\"}");
        }
        final HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setContentType(MediaType.APPLICATION_JSON);
        return new ResponseEntity<>(programsJson, httpHeaders, HttpStatus.OK);
    }

    @GetMapping("/{programSlug}")
    public ResponseEntity<String> getProgramDetailsBySlug(
            @PathVariable String clubSlug,
            @PathVariable String programSlug) {
        String programDetailsJson = programService.getProgramDetailsWithCoursesAsJson(clubSlug, programSlug);
        if (isEmptyJsonResult(programDetailsJson)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("{\"message\": \"Program not found or no courses associated.\"}");
        }
        final HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setContentType(MediaType.APPLICATION_JSON);
        return new ResponseEntity<>(programDetailsJson, httpHeaders, HttpStatus.OK);
    }

    @GetMapping("/{programSlug}/users")
    public ResponseEntity<String> getProgramParticipantProgress(
            @PathVariable String clubSlug,
            @PathVariable String programSlug) {
        String progressJson = programService.getProgramParticipantProgressAsJson(clubSlug, programSlug);
        if (isEmptyJsonResult(progressJson)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("{\"message\": \"Program not found or no participant progress data available.\"}");
        }
        final HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setContentType(MediaType.APPLICATION_JSON);
        return new ResponseEntity<>(progressJson, httpHeaders, HttpStatus.OK);
    }

    private boolean isEmptyJsonResult(String json) {
        if (json == null || json.trim().isEmpty()) return true;
        String trimmed = json.trim();
        return "{}".equals(trimmed) || "[]".equals(trimmed);
    }

}
