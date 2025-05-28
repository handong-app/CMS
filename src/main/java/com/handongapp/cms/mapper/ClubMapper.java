package com.handongapp.cms.mapper;

import com.handongapp.cms.dto.TbClubDto;
import org.apache.ibatis.annotations.Param;

public interface ClubMapper {
    TbClubDto.ClubCourseInfoResDto getCourseInfo(@Param("clubName") String clubName,
                                                 @Param("courseName") String courseName);
}
