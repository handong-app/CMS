package com.handongapp.cms.service;

import com.handongapp.cms.dto.v1.CourseDto;
import java.util.List;

public interface CourseService {
    CourseDto.Response create(String clubId, String userId, CourseDto.CreateRequest req);
    
    // ID 기반 메소드
    CourseDto.Response get(String id);
    CourseDto.Response update(String id, CourseDto.UpdateRequest req);
    void deleteSoft(String id);
    
    // Slug 기반 메소드
    CourseDto.Response getBySlug(String slug);
    CourseDto.Response updateBySlug(String clubId, String slug, CourseDto.UpdateRequest req);
    void deleteSoftBySlug(String slug);
    
    // 목록 조회 메소드
    List<CourseDto.Response> listByClub(String clubId);
}
