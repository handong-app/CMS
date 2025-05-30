package com.handongapp.cms.controller.v1;

import com.handongapp.cms.dto.v1.CommentDto;
import com.handongapp.cms.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/targets/{targetId}/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @PostMapping
    public ResponseEntity<CommentDto.Response> create(
            @PathVariable String targetId,
            @RequestParam String userId, // TODO: JWT 인증 도입 시 Principal 객체 등으로 대체
            @RequestBody @Valid CommentDto.CreateRequest req) {
        CommentDto.Response response = commentService.create(targetId, userId, req);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<CommentDto.Response>> listByTarget(
            @PathVariable String targetId) {
        List<CommentDto.Response> responses = commentService.listByTarget(targetId);
        return ResponseEntity.ok(responses);
    }

    @PatchMapping("/{commentId}")
    public ResponseEntity<CommentDto.Response> update(
            @PathVariable String targetId, // 경로 일관성 유지, 실제 로직에서는 commentId 사용
            @PathVariable String commentId,
            @RequestParam String userId, // TODO: JWT 인증 도입 시 Principal 객체 등으로 대체
            @RequestBody @Valid CommentDto.UpdateRequest req) {
        CommentDto.Response response = commentService.update(commentId, userId, req);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> delete(
            @PathVariable String targetId, // 경로 일관성 유지
            @PathVariable String commentId,
            @RequestParam String userId) { // TODO: JWT 인증 도입 시 Principal 객체 등으로 대체
        commentService.deleteSoft(commentId, userId);
        return ResponseEntity.noContent().build();
    }
}
