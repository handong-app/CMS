package com.handongapp.cms.controller;

import com.handongapp.cms.dto.NodeCreateRequest;
import com.handongapp.cms.dto.NodeResponse;
import com.handongapp.cms.dto.NodeUpdateRequest;
import com.handongapp.cms.service.NodeService;
//import com.handongapp.cms.service.validator.CourseHierarchyValidator;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/courses/{courseId}/sections/{sectionId}/node-groups/{nodeGroupId}/nodes")
@RequiredArgsConstructor
public class NodeController {

    private final NodeService nodeService;
    //private final CourseHierarchyValidator validator;

    @PostMapping
    public ResponseEntity<NodeResponse> create(
            @PathVariable String courseId,
            @PathVariable String sectionId,
            @PathVariable String nodeGroupId, 
            @RequestBody @Valid NodeCreateRequest req) {

        //validator.validateNodeGroupHierarchy(courseId, sectionId, nodeGroupId);
        NodeResponse result = nodeService.create(nodeGroupId, req);
        return ResponseEntity.ok(result);
    }

    @GetMapping
    public ResponseEntity<List<NodeResponse>> list(
            @PathVariable String courseId,
            @PathVariable String sectionId,
            @PathVariable String nodeGroupId) {

        //validator.validateNodeGroupHierarchy(courseId, sectionId, nodeGroupId);
        return ResponseEntity.ok(nodeService.listByGroup(nodeGroupId));
    }

    @GetMapping("/{nodeId}")
    public ResponseEntity<NodeResponse> get(
            @PathVariable String courseId,
            @PathVariable String sectionId,
            @PathVariable String nodeGroupId,
            @PathVariable String nodeId) {

        //validator.validateNodeGroupHierarchy(courseId, sectionId, nodeGroupId);
        return ResponseEntity.ok(nodeService.get(nodeId));
    }

    @PatchMapping("/{nodeId}")
    public ResponseEntity<NodeResponse> update(
            @PathVariable String courseId,
            @PathVariable String sectionId,
            @PathVariable String nodeGroupId,
            @PathVariable String nodeId,
            @RequestBody @Valid NodeUpdateRequest req) {

        //validator.validateNodeGroupHierarchy(courseId, sectionId, nodeGroupId);
        return ResponseEntity.ok(nodeService.update(nodeId, req));
    }

    @DeleteMapping("/{nodeId}")
    public ResponseEntity<Void> delete(
            @PathVariable String courseId,
            @PathVariable String sectionId,
            @PathVariable String nodeGroupId,
            @PathVariable String nodeId) {

        //validator.validateNodeGroupHierarchy(courseId, sectionId, nodeGroupId);
        nodeService.deleteSoft(nodeId);
        return ResponseEntity.noContent().build();
    }
}