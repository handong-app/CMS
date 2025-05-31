package com.handongapp.cms.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface ProgramMapper {

    String getProgramDetailsWithCoursesAsJson(@Param("clubSlug") String clubSlug, @Param("programSlug") String programSlug);

    String getProgramsWithCoursesByClubSlugAsJson(@Param("clubSlug") String clubSlug);

    String getProgramParticipantProgressAsJson(@Param("clubSlug") String clubSlug, @Param("programSlug") String programSlug);

}
