package com.handongapp.cms.repository;

import com.handongapp.cms.dto.v1.ClubDto;

import java.util.List;

public interface CourseRepositoryCustom {
    List<ClubDto.ClubCourseListResDto> findCoursesByClubIdAndProgramId(String clubName, String programId);
}
