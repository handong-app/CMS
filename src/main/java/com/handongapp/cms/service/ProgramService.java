package com.handongapp.cms.service;

import com.handongapp.cms.dto.v1.ProgramDto;
import org.springframework.security.core.Authentication;

public interface ProgramService {

    String getProgramDetailsWithCoursesAsJson(String clubSlug, String programSlug);

    String getProgramsWithCoursesByClubSlugAsJson(String clubSlug);

    String getProgramParticipantProgressAsJson(String clubSlug, String programSlug);

    // 프로그램 가입 메소드 추가
    void joinProgram(String clubSlug, String programSlug, Authentication authentication);

    ProgramDto.ResponseDto createProgram(String clubSlug, ProgramDto.CreateRequest requestDto, Authentication authentication);
}
