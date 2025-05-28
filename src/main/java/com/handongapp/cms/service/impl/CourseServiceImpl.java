package com.handongapp.cms.service.impl;

import com.handongapp.cms.dto.v1.ClubDto;
import com.handongapp.cms.repository.CourseRepository;
import com.handongapp.cms.service.CourseService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;

    public CourseServiceImpl(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    @Override
    public List<ClubDto.ClubCourseListResDto> getCourseList(String clubName, String programId) {
        return courseRepository.findCoursesByClubIdAndProgramId(clubName, programId);
    }
}
