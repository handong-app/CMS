package com.handongapp.cms.service;

import com.handongapp.cms.dto.TbClubDto;

public interface ClubService {

    TbClubDto.ClubProfileResDto getClubProfile(String clubName);

    void updateClubProfile(String clubName, TbClubDto.ClubProfileReqDto clubProfileResDto);

    void getAllProgramsList(String clubName);

    void getProgramInfo(String clubName, String programName);

    TbClubDto.ClubCourseInfoResDto getCourseInfo(String clubName, String courseName);
}
