package com.handongapp.cms.controller.v1;

import com.handongapp.cms.service.CourseService;
import com.handongapp.cms.dto.v1.SectionDto;
import com.handongapp.cms.service.SectionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/clubs/{clubSlug}/courses/{courseSlug}/sections")
@RequiredArgsConstructor
public class SectionController {

    private final SectionService sectionService;
    private final CourseService courseService;

    @PostMapping
    public ResponseEntity<SectionDto.Response> create(
            @PathVariable String clubSlug,
            @PathVariable String courseSlug,
            @RequestBody @Valid SectionDto.CreateRequest req) {
        String courseId = getCourseIdFromSlug(courseSlug);
        return ResponseEntity.ok(sectionService.create(courseId, req));
    }

    @GetMapping
    public ResponseEntity<List<SectionDto.Response>> list(
            @PathVariable String clubSlug,
            @PathVariable String courseSlug) {
        String courseId = getCourseIdFromSlug(courseSlug);
        return ResponseEntity.ok(sectionService.listByCourse(courseId));
    }

    @GetMapping("/{sectionId}")
    public ResponseEntity<SectionDto.Response> get(
            @PathVariable String clubSlug,
            @PathVariable String courseSlug,
            @PathVariable String sectionId) {
        return ResponseEntity.ok(sectionService.get(sectionId));
    }

    @PatchMapping("/{sectionId}")
    public ResponseEntity<SectionDto.Response> update(
            @PathVariable String clubSlug,
            @PathVariable String courseSlug,
            @PathVariable String sectionId,
            @RequestBody @Valid SectionDto.UpdateRequest req) {
        return ResponseEntity.ok(sectionService.update(sectionId, req));
    }

    @DeleteMapping("/{sectionId}")
    public ResponseEntity<Void> delete(
            @PathVariable String clubSlug,
            @PathVariable String courseSlug,
            @PathVariable String sectionId) {
        sectionService.deleteSoft(sectionId);
        return ResponseEntity.noContent().build();
    }
    
    // courseSlug로 courseId를 조회하는 헬퍼 메소드
    private String getCourseIdFromSlug(String courseSlug) {
        // CourseService를 주입받아 사용
        return courseService.getBySlug(courseSlug).getId();
    }
}
