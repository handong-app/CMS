package com.handongapp.cms.service.impl;

import com.handongapp.cms.domain.TbClub;
import com.handongapp.cms.dto.v1.ClubDto;
import com.handongapp.cms.mapper.ClubMapper;
import com.handongapp.cms.repository.ClubRepository;
import com.handongapp.cms.service.ClubService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class ClubServiceImpl implements ClubService {

    private final ClubRepository clubRepository;
    private final ClubMapper clubMapper;
    private final ObjectMapper objectMapper;

    public ClubServiceImpl(ClubRepository clubRepository,
                           ClubMapper clubMapper,
                           ObjectMapper objectMapper) {
        this.clubRepository = clubRepository;
        this.clubMapper = clubMapper;
        this.objectMapper = objectMapper;
    }

    @Override
    public ClubDto.ClubProfileResDto getClubProfile(String clubSlug) {
            return clubRepository.findBySlug(clubSlug)
            .map(club -> new ClubDto.ClubProfileResDto(
            club.getName(),
            club.getSlug(),
            club.getDescription(),
            club.getBannerUrl()
            ))
            .orElse(null);
    }

    @Transactional
    public void updateClubProfile(String clubSlug, ClubDto.ClubProfileReqDto dto) {
        TbClub club = clubRepository.findBySlug(clubSlug)
            .orElse(new TbClub()); // 새 엔티티로 초기화 (upsert 구현 목적)
    
        club.setSlug(dto.getSlug());
        club.setName(dto.getName());
        club.setDescription(dto.getDescription());
        club.setBannerUrl(dto.getBannerUrl());
    
        clubRepository.save(club); 
    }
    

    @Override
    public String getCoursesByClubSlugAsJson(String clubSlug) {
        String rawJson = clubMapper.getCoursesByClubSlugAsJson(clubSlug);

        try {
            JsonNode node = objectMapper.readTree(rawJson);  // 여기서 실패하면 예외 catch로 이동
            return objectMapper.writeValueAsString(node);
        } catch (Exception e) {
            throw new IllegalStateException("코스 JSON 파싱/직렬화에 실패했습니다.", e);
        }
    }
}
