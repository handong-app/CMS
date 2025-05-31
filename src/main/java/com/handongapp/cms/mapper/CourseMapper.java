package com.handongapp.cms.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface CourseMapper {

    String getCourseDetailsAsJsonBySlug(@Param("courseSlug") String courseSlug);

}
