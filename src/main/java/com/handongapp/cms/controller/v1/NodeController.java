package com.handongapp.cms.controller.v1;

import com.handongapp.cms.dto.v1.NodeDto;
import com.handongapp.cms.service.NodeService;
//import com.handongapp.cms.service.validator.CourseHierarchyValidator;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/nodes")
@RequiredArgsConstructor
public class NodeController {

    private final NodeService nodeService;
    //private final CourseHierarchyValidator validator;

    @PostMapping
    public ResponseEntity<NodeDto.Response> create(
            @RequestBody @Valid NodeDto.CreateRequest req) {

        //validator.validateNodeGroupHierarchy(courseId, sectionId, nodeGroupId);
        NodeDto.Response result = nodeService.create(req); // nodeGroupId 파라미터 없이 호출
        return ResponseEntity.ok(result);
    }

    @GetMapping
    public ResponseEntity<List<NodeDto.Response>> list(
            @RequestParam("nodeGroup") String nodeGroupId) {

        // validator.validateNodeGroupHierarchy(courseId, sectionId, nodeGroupId);
        return ResponseEntity.ok(nodeService.listByGroup(nodeGroupId));
    }

    @GetMapping("/{nodeId}")
    public ResponseEntity<NodeDto.Response> get(
            @PathVariable String nodeId) {

        //validator.validateNodeGroupHierarchy(courseId, sectionId, nodeGroupId);
        return ResponseEntity.ok(nodeService.get(nodeId));
    }

    @PatchMapping("/{nodeId}")
    public ResponseEntity<NodeDto.Response> update(
            @PathVariable String nodeId,
            @RequestBody @Valid NodeDto.UpdateRequest req) {

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