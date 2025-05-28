package com.handongapp.cms.service;

import com.handongapp.cms.dto.v1.ClubDto;

import java.util.List;

public interface CourseService {
    List<ClubDto.ClubCourseListResDto> getCourseList(String clubName, String programId);
}