package app.handong.cms.service;

import app.handong.cms.dto.v1.ClubDto;
import org.springframework.security.core.Authentication;

import java.util.List;

public interface ClubService {

    ClubDto.ClubProfileResDto getClubProfile(String clubSlug);

    void updateClubProfile(String clubSlug, ClubDto.ClubProfileReqDto clubProfileReqDto);

    String getCoursesByClubSlugAsJson(String clubSlug);

    ClubDto.ClubProfileResDto createClub(ClubDto.ClubProfileReqDto dto);

    void deleteClub(String clubSlug);

    List<ClubDto.ClubListInfoResponseDto> getAllClubs(Authentication authentication);

    /**
     * 사용자를 특정 동아리에 가입시키고 기수 정보를 등록합니다.
     *
     * @param clubSlug 가입할 동아리의 slug
     * @param joinRequestDto 가입 요청 정보 (기수 포함)
     * @param authentication 인증 정보
     */
    void joinClub(String clubSlug, ClubDto.ClubJoinRequestDto joinRequestDto, Authentication authentication);
}
