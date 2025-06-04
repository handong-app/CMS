package com.handongapp.cms.service;

import com.handongapp.cms.dto.v1.CourseDto;

public interface CourseService {
    CourseDto.Response create(String clubSlug, String userId, CourseDto.CreateRequest req);
    CourseDto.Response getBySlug(String slug);
    CourseDto.Response updateBySlug(String clubSlug, String courseSlug, CourseDto.UpdateRequest req);
    void deleteSoftBySlug(String slug);
    String getCourseDetailsAsJsonBySlug(String courseSlug);
}