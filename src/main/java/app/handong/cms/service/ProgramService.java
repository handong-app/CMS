package app.handong.cms.service;

import app.handong.cms.dto.v1.ProgramDto;
import org.springframework.security.core.Authentication;

public interface ProgramService {

    void addCourseToProgram(String clubSlug, String programSlug, String courseSlug, Authentication authentication);

    String getProgramDetailsWithCoursesAsJson(String clubSlug, String programSlug);

    String getProgramsWithCoursesByClubSlugAsJson(String clubSlug, String currentUserId);

    String getProgramParticipantProgressAsJson(String clubSlug, String programSlug);

    // 프로그램 가입 메소드 추가
    void joinProgram(String clubSlug, String programSlug, Authentication authentication);

    ProgramDto.ResponseDto createProgram(String clubSlug, ProgramDto.CreateRequest requestDto, Authentication authentication);
}
