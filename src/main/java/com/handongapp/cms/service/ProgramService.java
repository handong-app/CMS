package com.handongapp.cms.service;

public interface ProgramService {

    String getProgramDetailsWithCoursesAsJson(String clubSlug, String programSlug);

    String getProgramsWithCoursesByClubSlugAsJson(String clubSlug);

    String getProgramParticipantProgressAsJson(String clubSlug, String programSlug);

}
