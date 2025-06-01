package com.handongapp.cms.controller.v1;

import com.handongapp.cms.dto.v1.NodeGroupDto;
import com.handongapp.cms.service.NodeGroupService;
import java.util.Collections; 
import java.util.Optional;    
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/v1/node-group")
@RequiredArgsConstructor
public class NodeGroupController {

    private final NodeGroupService nodeGroupService;

    // @PostMapping
    // public ResponseEntity<NodeGroupDto.Response> create(
    //         @PathVariable String clubId,
    //         @PathVariable String courseSlug,
    //         @PathVariable String sectionId,
    //         @RequestBody @Valid NodeGroupDto.CreateRequest req) {
    //     req.setSectionId(sectionId); // URL의 sectionId를 DTO에 설정
    //     return ResponseEntity.status(HttpStatus.CREATED).body(nodeGroupService.create(req));
    // }

    @GetMapping("/{nodeGroupId}")
    public ResponseEntity<String> get(
            @PathVariable String nodeGroupId) {
        String nodeGroupJson = nodeGroupService.fetchAllInfo(nodeGroupId);
        if (nodeGroupJson == null || nodeGroupJson.equals("{}") || nodeGroupJson.equals("[]")) { // 결과가 없거나 빈 객체/배열일 경우
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("{\"message\": \"NodeGroup not found.\"}");
        }
        final HttpHeaders httpHeaders= new HttpHeaders();
        httpHeaders.setContentType(MediaType.APPLICATION_JSON);
        return new ResponseEntity<>(nodeGroupJson, httpHeaders, HttpStatus.OK);
    }

    // @PatchMapping("/{nodeGroupId}")
    // public ResponseEntity<NodeGroupDto.Response> update(
    //         @PathVariable String nodeGroupId,
    //         @RequestBody @Valid NodeGroupDto.UpdateRequest req) {
    //     return ResponseEntity.ok(nodeGroupService.update(nodeGroupId, req));
    // }

    // @DeleteMapping("/{nodeGroupId}")
    // public ResponseEntity<Void> delete(
    //         @PathVariable String nodeGroupId,
    //         @PathVariable String nodeGroupId) {
    //     nodeGroupService.deleteSoft(nodeGroupId);
    //     return ResponseEntity.noContent().build();
    // }

    @GetMapping("/next")
    public ResponseEntity<?> getNextNodeGroupInfo(@RequestParam String nodeGroupId) {
        Optional<NodeGroupDto.NextNodeGroupResponseDto> nextNodeGroupData = nodeGroupService.getNextNodeGroupInSectionOrCourse(nodeGroupId);
        return nextNodeGroupData.<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.ok(Collections.emptyMap()));
    }
}
