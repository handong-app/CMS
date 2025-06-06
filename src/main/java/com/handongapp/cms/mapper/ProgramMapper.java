package com.handongapp.cms.mapper;

import com.handongapp.cms.dto.v1.ProgramDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ProgramMapper {

    String getProgramDetailsWithCoursesAsJson(@Param("clubSlug") String clubSlug, @Param("programSlug") String programSlug);

    String getProgramsWithCoursesByClubSlugAsJson(@Param("clubSlug") String clubSlug, @Param("currentUserId") String currentUserId);

    String getProgramParticipantProgressAsJson(@Param("clubSlug") String clubSlug, @Param("programSlug") String programSlug);

    List<ProgramDto.ResponseDto> findProgramsByUserId(@Param("userId") String userId);
    

}
