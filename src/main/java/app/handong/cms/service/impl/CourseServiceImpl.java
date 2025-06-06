package app.handong.cms.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import app.handong.cms.domain.TbCourse;
import app.handong.cms.domain.enums.FileStatus;
import app.handong.cms.dto.v1.CourseDto;
import app.handong.cms.exception.data.NotFoundException;
import app.handong.cms.repository.ClubRepository;
import app.handong.cms.repository.CourseRepository;
import app.handong.cms.service.CourseService;
import app.handong.cms.service.PresignedUrlService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import app.handong.cms.mapper.CourseMapper;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

import java.time.Duration;

@Service
@RequiredArgsConstructor
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;
    private final ClubRepository clubRepository;
    private final CourseMapper courseMapper;
    private final ObjectMapper objectMapper;
    private final PresignedUrlService presignedUrlService;


    @Override
    @Transactional
    public CourseDto.Response create(String clubSlug, String userId, CourseDto.CreateRequest req) {
        courseRepository.findBySlugAndDeleted(req.getSlug(), "N").ifPresent(c -> {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 사용중인 클럽 Slug 입니다: " + req.getSlug());
        });
        String clubId = clubRepository.findBySlugAndDeleted(clubSlug, "N")
                .orElseThrow(() -> new EntityNotFoundException("클럽을 찾을 수 없습니다. Slug: " + clubSlug)).getId();
        TbCourse entity = req.toEntity(clubId, userId);
        TbCourse savedCourse = courseRepository.save(entity);
        return CourseDto.Response.from(savedCourse);
    }

    @Override
    @Transactional(readOnly = true)
    public CourseDto.Response getBySlug(String slug) {
        TbCourse course = courseRepository.findBySlugAndDeleted(slug, "N")
                .orElseThrow(() -> new EntityNotFoundException("코스를 찾을 수 없습니다. Slug: " + slug));
        return CourseDto.Response.from(course);
    }

    @Override
    @Transactional
    public CourseDto.Response updateBySlug(String clubSlug, String courseSlug, CourseDto.UpdateRequest req) {
        String clubId = clubRepository.findBySlugAndDeleted(clubSlug, "N")
                .orElseThrow(() -> new EntityNotFoundException("클럽을 찾을 수 없습니다. Slug: " + clubSlug)).getId();
        TbCourse entity = courseRepository.findByClubIdAndSlugAndDeleted(clubId, courseSlug, "N")
                .orElseThrow(() -> new EntityNotFoundException("코스를 찾을 수 없습니다. Club ID: " + clubId + ", Slug: " + courseSlug));
        req.applyTo(entity);
        return CourseDto.Response.from(entity);
    }

    @Override
    @Transactional
    public void deleteSoftBySlug(String slug) {
        TbCourse entity = courseRepository.findBySlugAndDeleted(slug, "N")
                .orElseThrow(() -> new EntityNotFoundException("코스를 찾을 수 없습니다. Slug: " + slug));
        entity.setDeleted("Y");
    }

    @Override
    @Transactional(readOnly = true)
    public String getCourseDetailsAsJsonBySlug(String courseSlug) {
        String rawJson = courseMapper.getCourseDetailsAsJsonBySlug(courseSlug);

        try {
            JsonNode root = objectMapper.readTree(rawJson);

            if (root.isObject()) {
                String courseId = root.path("id").asText(null);
                if (StringUtils.hasText(courseId)) {
                    TbCourse course = courseRepository.findById(courseId)
                            .orElseThrow(() -> new NotFoundException("Course not found with id: " + courseId));

                    if (StringUtils.hasText(course.getFileKey()) && FileStatus.UPLOADED.equals(course.getFileStatus())) {
                        String presignedUrl = presignedUrlService
                                .generateDownloadUrl(course.getFileKey(), Duration.ofMinutes(60))
                                .toString();

                        ((ObjectNode) root).put("pictureUrl", presignedUrl);
                    }
                }
            }

            return objectMapper.writeValueAsString(root);
        } catch (Exception e) {
            throw new IllegalStateException("코스 JSON 파싱/직렬화에 실패했습니다.", e);
        }
    }
}
