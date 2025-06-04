package com.handongapp.cms.service;

import com.handongapp.cms.dto.v1.ClubDto;

public interface ClubService {

    ClubDto.ClubProfileResDto getClubProfile(String clubSlug);

    void updateClubProfile(String clubSlug, ClubDto.ClubProfileReqDto clubProfileReqDto);

    String getCoursesByClubSlugAsJson(String clubSlug);

    ClubDto.ClubProfileResDto createClub(ClubDto.ClubProfileReqDto dto);

    void deleteClub(String clubSlug);

    void updateClubBanner(String clubId, String fileKey);
}
