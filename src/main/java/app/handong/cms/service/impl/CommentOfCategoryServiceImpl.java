package app.handong.cms.service.impl;

import app.handong.cms.domain.TbCourse;
import app.handong.cms.dto.v1.CommentOfCategoryDto;
import app.handong.cms.exception.data.NotFoundException;
import app.handong.cms.repository.CommentOfCategoryRepository;
import app.handong.cms.repository.CourseRepository;
import app.handong.cms.service.CommentOfCategoryService;
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
