package com.handongapp.cms.service.impl;

import com.handongapp.cms.domain.TbCourse;
import com.handongapp.cms.dto.v1.CourseDto;
import com.handongapp.cms.dto.v1.ClubDto;
import com.handongapp.cms.repository.CourseRepository;
import com.handongapp.cms.service.CourseService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;

    @Override
    @Transactional
    public CourseDto.Response create(String clubId, String userId, CourseDto.CreateRequest req) {
        TbCourse entity = req.toEntity(clubId, userId);
        TbCourse savedCourse = courseRepository.save(entity);
        return CourseDto.Response.from(savedCourse);
    }

    @Override
    @Transactional(readOnly = true)
    public CourseDto.Response get(String id) {
        TbCourse course = courseRepository.findByIdAndDeleted(id, "N")
                .orElseThrow(() -> new EntityNotFoundException("코스를 찾을 수 없습니다. ID: " + id));
        return CourseDto.Response.from(course);
    }

    @Override
    @Transactional(readOnly = true)
    public CourseDto.Response getBySlug(String slug) {
        TbCourse course = courseRepository.findBySlugAndDeleted(slug, "N")
                .orElseThrow(() -> new EntityNotFoundException("코스를 찾을 수 없습니다. Slug: " + slug));
        return CourseDto.Response.from(course);
    }


    @Override
    @Transactional(readOnly = true)
    public List<CourseDto.Response> listByClub(String clubId) {
        return courseRepository.findByClubIdAndDeleted(clubId, "N")
                .stream()
                .map(CourseDto.Response::from)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CourseDto.Response update(String id, CourseDto.UpdateRequest req) {
        TbCourse entity = courseRepository.findByIdAndDeleted(id, "N")
                .orElseThrow(() -> new EntityNotFoundException("코스를 찾을 수 없습니다. ID: " + id));
        req.applyTo(entity);
        return CourseDto.Response.from(entity);
    }

    @Override
    @Transactional
    public CourseDto.Response updateBySlug(String clubId, String slug, CourseDto.UpdateRequest req) {
        TbCourse entity = courseRepository.findByClubIdAndSlugAndDeleted(clubId, slug, "N")
                .orElseThrow(() -> new EntityNotFoundException("코스를 찾을 수 없습니다. Club ID: " + clubId + ", Slug: " + slug));
        req.applyTo(entity);
        return CourseDto.Response.from(entity);
    }

    @Override
    @Transactional
    public void deleteSoft(String id) {
        TbCourse entity = courseRepository.findByIdAndDeleted(id, "N")
                .orElseThrow(() -> new EntityNotFoundException("코스를 찾을 수 없습니다. ID: " + id));
        entity.setDeleted("Y");
    }

    @Override
    @Transactional
    public void deleteSoftBySlug(String slug) {
        TbCourse entity = courseRepository.findBySlugAndDeleted(slug, "N")
                .orElseThrow(() -> new EntityNotFoundException("코스를 찾을 수 없습니다. Slug: " + slug));
        entity.setDeleted("Y");
    }
}
