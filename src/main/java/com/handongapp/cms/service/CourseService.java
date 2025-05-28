package com.handongapp.cms.service;

import com.handongapp.cms.dto.v1.TbClubDto;

import java.util.List;

public interface CourseService {
    List<TbClubDto.ClubCourseListResDto> getCourseList(String clubName, String programId);
}