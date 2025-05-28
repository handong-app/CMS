package com.handongapp.cms.service.impl;

import com.handongapp.cms.domain.TbClub;
import com.handongapp.cms.dto.TbClubDto;
import com.handongapp.cms.mapper.ClubMapper;
import com.handongapp.cms.repository.TbClubRepository;
import com.handongapp.cms.service.ClubService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
public class ClubServiceImpl implements ClubService {

    private final TbClubRepository clubRepository;
    private final ClubMapper clubMapper;

    public ClubServiceImpl(TbClubRepository clubRepository,
                           ClubMapper clubMapper) {
        this.clubRepository = clubRepository;
        this.clubMapper = clubMapper;
    }

    @Override
    public TbClubDto.ClubProfileResDto getClubProfile(String clubName) {
            return clubRepository.findByName(clubName)
            .map(club -> new TbClubDto.ClubProfileResDto(
            club.getName(),
            club.getSlug(),
            club.getDescription(),
            club.getBannerUrl()
            ))
            .orElse(null);
    }

    @Override
    @Transactional
    public void updateClubProfile(String clubName, TbClubDto.ClubProfileReqDto clubProfileResDto) {
        clubRepository.save(new TbClub(clubName, clubProfileResDto.getSlug(), clubProfileResDto.getDescription(), clubProfileResDto.getBannerUrl()));
    }

    @Override
    public void getAllProgramsList(String clubName) {

    }

    @Override
    public void getProgramInfo(String clubName, String programName) {

    }

    @Override
    public TbClubDto.ClubCourseInfoResDto getCourseInfo(String clubName, String courseName) {
        return clubMapper.getCourseInfo(clubName, courseName);
    }

}
