package com.handongapp.cms.mapper;

import com.handongapp.cms.dto.v1.ClubDto;
import org.apache.ibatis.annotations.Param;

public interface ClubMapper {
    ClubDto.ClubCourseInfoResDto getCourseInfo(@Param("clubName") String clubName,
                                               @Param("courseName") String courseName);
}
