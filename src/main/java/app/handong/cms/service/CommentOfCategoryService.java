package app.handong.cms.service;

import app.handong.cms.dto.v1.CommentOfCategoryDto;

import java.util.List;

public interface CommentOfCategoryService {
    List<CommentOfCategoryDto.Response> getCategoriesByCourseSlug(String courseSlug);
}
