package com.handongapp.cms.service.impl;

import com.handongapp.cms.domain.TbClub;
import com.handongapp.cms.dto.v1.ClubDto;
import com.handongapp.cms.mapper.ClubMapper;
import com.handongapp.cms.repository.ClubRepository;
import com.handongapp.cms.service.ClubService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
public class ClubServiceImpl implements ClubService {

    private final ClubRepository clubRepository;
    private final ClubMapper clubMapper;

    public ClubServiceImpl(ClubRepository clubRepository,
                           ClubMapper clubMapper) {
        this.clubRepository = clubRepository;
        this.clubMapper = clubMapper;
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
        return clubMapper.getCoursesByClubSlugAsJson(clubSlug);
    }
}
