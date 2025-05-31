package com.handongapp.cms.service.impl;

import com.handongapp.cms.mapper.ProgramMapper;
import com.handongapp.cms.service.ProgramService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProgramServiceImpl implements ProgramService {

    private final ProgramMapper programMapper;

    @Override
    @Transactional(readOnly = true)
    public String getProgramDetailsWithCoursesAsJson(String clubSlug, String programSlug) {
        return programMapper.getProgramDetailsWithCoursesAsJson(clubSlug, programSlug);
    }

    @Override
    @Transactional(readOnly = true)
    public String getProgramsWithCoursesByClubSlugAsJson(String clubSlug) {
        return programMapper.getProgramsWithCoursesByClubSlugAsJson(clubSlug);
    }

    @Override
    @Transactional(readOnly = true)
    public String getProgramParticipantProgressAsJson(String clubSlug, String programSlug) {
        return programMapper.getProgramParticipantProgressAsJson(clubSlug, programSlug);
    }
}
