package com.handongapp.cms.service.impl;

import com.handongapp.cms.dto.v1.TbClubDto;
import com.handongapp.cms.repository.TbCourseRepository;
import com.handongapp.cms.service.CourseService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseServiceImpl implements CourseService {

    private final TbCourseRepository courseRepository;

    public CourseServiceImpl(TbCourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    @Override
    public List<TbClubDto.ClubCourseListResDto> getCourseList(String clubName, String programId) {
        return courseRepository.findCoursesByClubIdAndProgramId(clubName, programId);
    }
}
