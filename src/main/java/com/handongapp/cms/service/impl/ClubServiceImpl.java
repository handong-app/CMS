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
    public ClubDto.ClubProfileResDto getClubProfile(String clubName) {
            return clubRepository.findByName(clubName)
            .map(club -> new ClubDto.ClubProfileResDto(
            club.getName(),
            club.getSlug(),
            club.getDescription(),
            club.getBannerUrl()
            ))
            .orElse(null);
    }

    @Override
    @Transactional
    public void updateClubProfile(String clubName, ClubDto.ClubProfileReqDto clubProfileResDto) {
        clubRepository.save(new TbClub(clubName, clubProfileResDto.getSlug(), clubProfileResDto.getDescription(), clubProfileResDto.getBannerUrl()));
    }

    @Override
    public void getAllProgramsList(String clubName) {

    }

    @Override
    public void getProgramInfo(String clubName, String programName) {

    }

    @Override
    public ClubDto.ClubCourseInfoResDto getCourseInfo(String clubName, String courseName) {
        return clubMapper.getCourseInfo(clubName, courseName);
    }

}
