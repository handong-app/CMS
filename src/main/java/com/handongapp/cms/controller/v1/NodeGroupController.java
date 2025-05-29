package com.handongapp.cms.controller.v1;

import com.handongapp.cms.dto.v1.NodeGroupDto;

import com.handongapp.cms.service.NodeGroupService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/clubs/{clubId}/courses/{courseSlug}/sections/{sectionId}/node-groups")
@RequiredArgsConstructor
public class NodeGroupController {

    private final NodeGroupService nodeGroupService;

    @PostMapping
    public ResponseEntity<NodeGroupDto.Response> create(
            @PathVariable String clubId,
            @PathVariable String courseSlug,
            @PathVariable String sectionId,
            @RequestBody @Valid NodeGroupDto.CreateRequest req) {
        req.setSectionId(sectionId); // URL의 sectionId를 DTO에 설정
        return ResponseEntity.ok(nodeGroupService.create(req));
    }

    @GetMapping
    public ResponseEntity<List<NodeGroupDto.Response>> list(
            @PathVariable String clubId,
            @PathVariable String courseSlug,
            @PathVariable String sectionId) {
        return ResponseEntity.ok(nodeGroupService.listBySection(sectionId));
    }

    @GetMapping("/{nodeGroupId}")
    public ResponseEntity<NodeGroupDto.Response> get(
            @PathVariable String clubId,
            @PathVariable String courseSlug,
            @PathVariable String sectionId,
            @PathVariable String nodeGroupId) {
        return ResponseEntity.ok(nodeGroupService.get(nodeGroupId));
    }

    @PatchMapping("/{nodeGroupId}")
    public ResponseEntity<NodeGroupDto.Response> update(
            @PathVariable String clubId,
            @PathVariable String courseSlug,
            @PathVariable String sectionId,
            @PathVariable String nodeGroupId,
            @RequestBody @Valid NodeGroupDto.UpdateRequest req) {
        return ResponseEntity.ok(nodeGroupService.update(nodeGroupId, req));
    }

    @DeleteMapping("/{nodeGroupId}")
    public ResponseEntity<Void> delete(
            @PathVariable String clubId,
            @PathVariable String courseSlug,
            @PathVariable String sectionId,
            @PathVariable String nodeGroupId) {
        nodeGroupService.deleteSoft(nodeGroupId);
        return ResponseEntity.noContent().build();
    }
}
