package com.handongapp.cms.service;

import com.handongapp.cms.dto.TbClubDto;
import com.handongapp.cms.repository.TbCourseRepository;
import org.springframework.stereotype.Service;

import java.util.List;


public interface CourseService {
    List<TbClubDto.ClubCourseListResDto> getCourseList(String clubName, String programId);
}