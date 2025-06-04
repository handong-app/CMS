package com.handongapp.cms.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.handongapp.cms.domain.TbCourse;
import com.handongapp.cms.domain.enums.FileStatus;
import com.handongapp.cms.mapper.ProgramMapper;
import com.handongapp.cms.repository.CourseRepository;
import com.handongapp.cms.service.PresignedUrlService;
import com.handongapp.cms.service.ProgramService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.Duration;

@Service
@RequiredArgsConstructor
public class ProgramServiceImpl implements ProgramService {

    private final ProgramMapper programMapper;
    private final ObjectMapper objectMapper;

    private final CourseRepository courseRepository;
    private final PresignedUrlService presignedUrlService;

    @Override
    @Transactional(readOnly = true)
    public String getProgramDetailsWithCoursesAsJson(String clubSlug, String programSlug) {
        String rawJson = programMapper.getProgramDetailsWithCoursesAsJson(clubSlug, programSlug);

        try {
            JsonNode root = objectMapper.readTree(rawJson);

            if (root.isObject() && root.has("courses") && root.get("courses").isArray()) {
                for (JsonNode courseNode : root.get("courses")) {
                    String courseId = courseNode.path("id").asText(null);
                    if (StringUtils.hasText(courseId)) {
                        TbCourse course = courseRepository.findById(courseId)
                                .orElse(null);

                        if (course != null && StringUtils.hasText(course.getFileKey())
                                && FileStatus.UPLOADED.equals(course.getFileStatus())) {
                            String presignedUrl = presignedUrlService
                                    .generateDownloadUrl(course.getFileKey(), Duration.ofMinutes(60))
                                    .toString();

                            ((ObjectNode) courseNode).put("pictureUrl", presignedUrl);
                        }
                    }
                }
            }

            return objectMapper.writeValueAsString(root);
        } catch (Exception e) {
            throw new IllegalStateException("프로그램 JSON 파싱/직렬화에 실패했습니다.", e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public String getProgramsWithCoursesByClubSlugAsJson(String clubSlug) {
        String rawJson = programMapper.getProgramsWithCoursesByClubSlugAsJson(clubSlug);

        try {
            JsonNode node = objectMapper.readTree(rawJson);  // 여기서 실패하면 예외 catch로 이동
            return objectMapper.writeValueAsString(node);
        } catch (Exception e) {
            throw new IllegalStateException("프로그램 JSON 파싱/직렬화에 실패했습니다.", e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public String getProgramParticipantProgressAsJson(String clubSlug, String programSlug) {
        String rawJson = programMapper.getProgramParticipantProgressAsJson(clubSlug, programSlug);

        try {
            JsonNode node = objectMapper.readTree(rawJson);  // 여기서 실패하면 예외 catch로 이동
            return objectMapper.writeValueAsString(node);
        } catch (Exception e) {
            throw new IllegalStateException("프로그램 JSON 파싱/직렬화에 실패했습니다.", e);
        }
    }
}
