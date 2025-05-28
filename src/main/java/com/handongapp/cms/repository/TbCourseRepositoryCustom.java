package com.handongapp.cms.repository;

import com.handongapp.cms.dto.v1.TbClubDto;

import java.util.List;

public interface TbCourseRepositoryCustom {
    List<TbClubDto.ClubCourseListResDto> findCoursesByClubIdAndProgramId(String clubName, String programId);
}
