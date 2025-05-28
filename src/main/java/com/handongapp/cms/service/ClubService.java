package com.handongapp.cms.service;

import com.handongapp.cms.dto.v1.ClubDto;

public interface ClubService {

    ClubDto.ClubProfileResDto getClubProfile(String clubName);

    void updateClubProfile(String clubName, ClubDto.ClubProfileReqDto clubProfileResDto);

    void getAllProgramsList(String clubName);

    void getProgramInfo(String clubName, String programName);

    ClubDto.ClubCourseInfoResDto getCourseInfo(String clubName, String courseName);
}
