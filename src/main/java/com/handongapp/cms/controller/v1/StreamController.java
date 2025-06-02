package com.handongapp.cms.controller.v1;

import com.handongapp.cms.service.VideoNodeHlsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/stream")
public class StreamController {

    private final VideoNodeHlsService videoNodeHlsService;

    @GetMapping("/{nodeId}/master.m3u8")
    public ResponseEntity<String> getMasterPlaylist(@PathVariable String nodeId) {
        if (!StringUtils.hasText(nodeId))
            return ResponseEntity.badRequest().build();

        try {
            String masterM3u8 = videoNodeHlsService.getMasterPlaylist(nodeId);
            return ResponseEntity.ok()
                    .contentType(MediaType.valueOf("application/x-mpegURL"))
                    .body(masterM3u8);
        } catch (IllegalArgumentException e) {
            log.warn("Invalid nodeId for master playlist: {}", nodeId, e);
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Error generating master playlist for nodeId: {}", nodeId, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{nodeId}/{resolution}/output.m3u8")
    public ResponseEntity<String> getOutputPlaylist(@PathVariable String nodeId,
                                                    @PathVariable String resolution) {
        if (!StringUtils.hasText(nodeId) || !StringUtils.hasText(resolution)) {
            return ResponseEntity.badRequest().build();
        }

        try {
            String outputM3u8 = videoNodeHlsService.getResolutionPlaylist(nodeId, resolution);
            return ResponseEntity.ok()
                    .contentType(MediaType.valueOf("application/x-mpegURL"))
                    .body(outputM3u8);
        } catch (IllegalArgumentException e) {
            log.warn("Invalid parameters for output playlist - nodeId: {}, resolution: {}", nodeId, resolution, e);
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Error generating output playlist for nodeId: {}, resolution: {}", nodeId, resolution, e);
            return ResponseEntity.internalServerError().build();
        }
    }
}