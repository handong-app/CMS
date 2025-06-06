package app.handong.cms.repository;

import app.handong.cms.dto.v1.ClubDto;

import java.util.List;

public interface CourseRepositoryCustom {
    List<ClubDto.ClubCourseListResDto> findCoursesByClubIdAndProgramId(String clubName, String programId);
}
