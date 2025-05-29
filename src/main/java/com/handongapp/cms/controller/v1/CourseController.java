package com.handongapp.cms.controller.v1;

import com.handongapp.cms.dto.v1.CourseDto;
import com.handongapp.cms.service.CourseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/clubs/{clubId}/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;

    @PostMapping
    public ResponseEntity<CourseDto.Response> create(
            @PathVariable String clubId,
            @RequestParam String userId, // userId는 JWT에서 가져올 예정 테스트를 위해 일단은 RequestParam으로 받음
            @RequestBody @Valid CourseDto.CreateRequest req) {
        return ResponseEntity.ok(courseService.create(clubId, userId, req));
    }

    @GetMapping
    public ResponseEntity<List<CourseDto.Response>> listByClub(
            @PathVariable String clubId) {
        return ResponseEntity.ok(courseService.listByClub(clubId));
    }

    @GetMapping("/{courseSlug}")
    public ResponseEntity<CourseDto.Response> get(
            @PathVariable String clubId,
            @PathVariable String courseSlug) {
        return ResponseEntity.ok(courseService.getBySlug(courseSlug));
    }

    @PatchMapping("/{courseSlug}")
    public ResponseEntity<CourseDto.Response> update(
            @PathVariable String clubId,
            @PathVariable String courseSlug,
            @RequestBody @Valid CourseDto.UpdateRequest req) {
        return ResponseEntity.ok(courseService.updateBySlug(clubId, courseSlug, req));
    }

    @DeleteMapping("/{courseSlug}")
    public ResponseEntity<Void> delete(
            @PathVariable String clubId,
            @PathVariable String courseSlug) {
        courseService.deleteSoftBySlug(courseSlug);
        return ResponseEntity.noContent().build();
    }
}
