package com.handongapp.cms.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.handongapp.cms.domain.TbClub;
import com.handongapp.cms.dto.v1.ClubDto;
import com.handongapp.cms.mapper.ClubMapper;
import com.handongapp.cms.repository.ClubRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Optional;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.handongapp.cms.service.ClubService;

@Service
@RequiredArgsConstructor
public class ClubServiceImpl implements ClubService {

    private final ClubRepository clubRepository;
    private final ClubMapper clubMapper;
    private final ObjectMapper objectMapper;

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
    public void updateClubProfile(String clubSlug, ClubDto.ClubProfileReqDto dto) { //upsert
        Optional<TbClub> existingClubOpt = clubRepository.findBySlug(clubSlug);
        TbClub clubEntity;

        if (!existingClubOpt.isPresent()) { //insert 
            clubEntity = new TbClub();

            clubEntity.setSlug(clubSlug);

            if (!StringUtils.hasText(dto.getName())) {
                throw new IllegalArgumentException("새 클럽 생성 시 이름은 필수입니다.");
            }
            clubEntity.setName(dto.getName());
            clubEntity.setDescription(dto.getDescription());
            clubEntity.setBannerUrl(dto.getBannerUrl());
        } else { //update
            clubEntity = existingClubOpt.get();

            if (StringUtils.hasText(dto.getSlug()) && !dto.getSlug().equals(clubEntity.getSlug())) {
                String newSlug = dto.getSlug();
                Optional<TbClub> conflictingClubOpt = clubRepository.findBySlug(newSlug);
                if (conflictingClubOpt.isPresent()) {
                    throw new IllegalArgumentException("이미 다른 클럽이 사용중인 Slug입니다: " + newSlug);
                }
                clubEntity.setSlug(newSlug);
            }

            if (dto.getName() != null) {
                if (!StringUtils.hasText(dto.getName())) {
                    throw new IllegalArgumentException("클럽 이름은 비워둘 수 없습니다.");
                }
                clubEntity.setName(dto.getName());
            }

            if (dto.getDescription() != null) {
                clubEntity.setDescription(dto.getDescription());
            }

            if (dto.getBannerUrl() != null) {
                if (StringUtils.hasText(dto.getBannerUrl())) {
                    clubEntity.setBannerUrl(dto.getBannerUrl());
                } else {
                    clubEntity.setBannerUrl(null);
                }
            }
        }
        clubRepository.save(clubEntity);
    }

    @Override
    public String getCoursesByClubSlugAsJson(String clubSlug) {
        String rawJson = clubMapper.getCoursesByClubSlugAsJson(clubSlug);

        try {
            JsonNode node = objectMapper.readTree(rawJson);  // 여기서 실패하면 예외 catch로 이동
            return objectMapper.writeValueAsString(node);
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("코스 JSON 파싱/직렬화에 실패했습니다.", e);
        }
    }
}
