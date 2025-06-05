package com.handongapp.cms.controller.v1;

import com.handongapp.cms.dto.v1.CourseDto;
import com.handongapp.cms.security.PrincipalDetails;
import com.handongapp.cms.service.CourseService;
import com.handongapp.cms.service.ClubService;
import com.handongapp.cms.service.CommentOfCategoryService;
import com.handongapp.cms.dto.v1.CommentOfCategoryDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/clubs/{clubSlug}/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;
    private final ClubService clubService;
    private final CommentOfCategoryService commentOfCategoryService;

    @PostMapping
    public ResponseEntity<CourseDto.Response> create(
            @PathVariable String clubSlug,
            @RequestBody @Valid CourseDto.CreateRequest req, Authentication authentication) {
        PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();
        String userId = principalDetails.getUsername();
        return ResponseEntity.ok(courseService.create(clubSlug, userId, req));
    }

    @GetMapping()
    public ResponseEntity<String> getClubCoursesBySlug(@PathVariable String clubSlug) {
        String coursesJson = clubService.getCoursesByClubSlugAsJson(clubSlug);
        if (coursesJson == null || coursesJson.equals("[]")) { // 결과가 없거나 빈 배열일 경우
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("{\"message\": \"No courses found for this club or club does not exist.\"}");
        }
        final HttpHeaders httpHeaders= new HttpHeaders();
        httpHeaders.setContentType(MediaType.APPLICATION_JSON);
        return new ResponseEntity<>(coursesJson, httpHeaders, HttpStatus.OK);
    }

    @GetMapping("/{courseSlug}")
    public ResponseEntity<String> get(
            @PathVariable String courseSlug) {
        String courseJson = courseService.getCourseDetailsAsJsonBySlug(courseSlug);
        if (courseJson == null || courseJson.equals("{}") || courseJson.equals("[]")) { // 결과가 없거나 빈 객체/배열일 경우
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("{\"message\": \"Course not found.\"}");
        }
        final HttpHeaders httpHeaders= new HttpHeaders();
        httpHeaders.setContentType(MediaType.APPLICATION_JSON);
        return new ResponseEntity<>(courseJson, httpHeaders, HttpStatus.OK);
    }

    @PatchMapping("/{courseSlug}")
    public ResponseEntity<CourseDto.Response> update(
            @PathVariable String clubSlug,
            @PathVariable String courseSlug,
            @RequestBody @Valid CourseDto.UpdateRequest req) {
        return ResponseEntity.ok(courseService.updateBySlug(clubSlug, courseSlug, req));
    }

    @DeleteMapping("/{courseSlug}")
    public ResponseEntity<Void> delete(
            @PathVariable String courseSlug) {
        courseService.deleteSoftBySlug(courseSlug);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{courseSlug}/comment-categories")
    public ResponseEntity<List<CommentOfCategoryDto.Response>> getCommentCategoriesByCourseSlug(
            @PathVariable String clubSlug, // clubSlug is part of the path but might not be used directly by the service if courseSlug is unique
            @PathVariable String courseSlug) {
        List<CommentOfCategoryDto.Response> categories = commentOfCategoryService.getCategoriesByCourseSlug(courseSlug);
        if (categories.isEmpty()) {
            return ResponseEntity.noContent().build(); // Or ResponseEntity.notFound().build(); depending on desired behavior
        }
        return ResponseEntity.ok(categories);
    }
}
