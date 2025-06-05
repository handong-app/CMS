package com.handongapp.cms.service;

import com.handongapp.cms.dto.v1.ClubDto;
import org.springframework.security.core.Authentication;

import java.util.List;

public interface ClubService {

    ClubDto.ClubProfileResDto getClubProfile(String clubSlug);

    void updateClubProfile(String clubSlug, ClubDto.ClubProfileReqDto clubProfileReqDto);

    String getCoursesByClubSlugAsJson(String clubSlug);

    ClubDto.ClubProfileResDto createClub(ClubDto.ClubProfileReqDto dto);

    void deleteClub(String clubSlug);

    List<ClubDto.ClubListInfoResponseDto> getAllClubs(Authentication authentication);
}
