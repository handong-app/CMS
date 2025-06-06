package com.handongapp.cms.service;

import com.handongapp.cms.dto.v1.CommentOfCategoryDto;

import java.util.List;

public interface CommentOfCategoryService {
    List<CommentOfCategoryDto.Response> getCategoriesByCourseSlug(String courseSlug);
}
