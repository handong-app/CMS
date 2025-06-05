package com.handongapp.cms.service.impl;

import com.handongapp.cms.domain.TbCourse;
import com.handongapp.cms.dto.v1.CommentOfCategoryDto;
import com.handongapp.cms.exception.data.NotFoundException;
import com.handongapp.cms.repository.CommentOfCategoryRepository;
import com.handongapp.cms.repository.CourseRepository;
import com.handongapp.cms.service.CommentOfCategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentOfCategoryServiceImpl implements CommentOfCategoryService {

    private final CourseRepository courseRepository;
    private final CommentOfCategoryRepository commentOfCategoryRepository;

    @Override
    @Transactional(readOnly = true)
    public List<CommentOfCategoryDto.Response> getCategoriesByCourseSlug(String courseSlug) {
        TbCourse course = courseRepository.findBySlugAndDeleted(courseSlug, "N")
                .orElseThrow(() -> new NotFoundException("Course not found with slug: " + courseSlug));

        return commentOfCategoryRepository.findByCourseIdAndDeletedOrderByCreatedAtAsc(course.getId(), "N")
                .stream()
                .map(CommentOfCategoryDto.Response::from)
                .collect(Collectors.toList());
    }
}
