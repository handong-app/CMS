package com.handongapp.cms.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.handongapp.cms.domain.TbCourse;
import com.handongapp.cms.domain.enums.FileStatus;
import com.handongapp.cms.dto.v1.CourseDto;
import com.handongapp.cms.exception.data.NotFoundException;
import com.handongapp.cms.repository.ClubRepository;
import com.handongapp.cms.repository.CourseRepository;
import com.handongapp.cms.service.CourseService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.handongapp.cms.mapper.CourseMapper;

@Service
@RequiredArgsConstructor
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;
    private final ClubRepository clubRepository;
    private final CourseMapper courseMapper;
    private final ObjectMapper objectMapper;


    @Override
    @Transactional
    public CourseDto.Response create(String clubSlug, String userId, CourseDto.CreateRequest req) {
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
            JsonNode node = objectMapper.readTree(rawJson);  // 여기서 실패하면 예외 catch로 이동
            return objectMapper.writeValueAsString(node);
        } catch (Exception e) {
            throw new IllegalStateException("코스 JSON 파싱/직렬화에 실패했습니다.", e);
        }
    }

    @Override
    public void updateCourseBanner(String courseId, String fileKey) {
        TbCourse course = courseRepository.findById(courseId)
                .orElseThrow(() -> new NotFoundException("Course not found with id: " + courseId));
        course.setFileKey(fileKey);
        course.setFileStatus(FileStatus.UPLOADING);
        courseRepository.save(course);
    }
}
