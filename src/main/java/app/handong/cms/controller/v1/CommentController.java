package app.handong.cms.controller.v1;

import app.handong.cms.dto.v1.CommentDto;
import app.handong.cms.dto.v1.CommentResponseDto;
import app.handong.cms.exception.auth.NoAuthenticatedException;
import app.handong.cms.security.PrincipalDetails;
import app.handong.cms.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @PostMapping
    public ResponseEntity<CommentDto.Response> create(
            Authentication authentication,
            @RequestBody @Valid CommentDto.CreateRequest req) {
        String userId = extractUserId(authentication);
        CommentDto.Response response = commentService.create(userId, req);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PatchMapping("/{commentId}")
    public ResponseEntity<CommentDto.Response> update(
            Authentication authentication,
            @PathVariable String commentId,
            @RequestBody @Valid CommentDto.UpdateRequest req) {
        String userId = extractUserId(authentication);
        CommentDto.Response response = commentService.update(commentId, userId, req);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> delete(
            Authentication authentication,
            @PathVariable String commentId) {
        String userId = extractUserId(authentication);
        commentService.deleteSoft(commentId, userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<CommentResponseDto>> searchComments(
            @RequestParam(required = false) String courseId,
            @RequestParam(required = false) String courseSlug,
            @RequestParam(required = false) String courseName,
            @RequestParam(required = false) String nodeGroupId,
            @RequestParam(required = false) String userId,
            @RequestParam(required = false) String username
    ) {
        List<CommentResponseDto> responses = commentService.searchComments(
                courseId, courseSlug, courseName, nodeGroupId, userId, username
        );
        return ResponseEntity.ok(responses);
    }

    private String extractUserId(Authentication authentication) {
        if (authentication == null || authentication.getPrincipal() == null) {
            throw new NoAuthenticatedException("인증 정보가 없습니다");
        }
        if (!(authentication.getPrincipal() instanceof PrincipalDetails)) {
            throw new IllegalStateException("잘못된 인증 타입입니다");
        }
        PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();
        
        return principalDetails.getUsername();
    }
}
