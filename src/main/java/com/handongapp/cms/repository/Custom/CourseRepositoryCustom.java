package com.handongapp.cms.repository.Custom;

import com.handongapp.cms.dto.TbClubDto;

import java.util.List;

public interface CourseRepositoryCustom {
    List<TbClubDto.ClubCourseListResDto> findCoursesByClubAndProgram(String clubName, String programId);
}
