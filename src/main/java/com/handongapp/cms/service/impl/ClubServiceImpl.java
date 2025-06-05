package com.handongapp.cms.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.handongapp.cms.domain.TbClub;
import com.handongapp.cms.domain.TbCourse;
import com.handongapp.cms.domain.enums.FileStatus;
import com.handongapp.cms.dto.v1.ClubDto;
import com.handongapp.cms.mapper.ClubMapper;
import com.handongapp.cms.repository.ClubRepository;
import com.handongapp.cms.repository.CourseRepository;
import com.handongapp.cms.repository.TbUserClubRoleRepository;
import org.springframework.security.core.Authentication;

import com.handongapp.cms.service.ClubService;
import com.handongapp.cms.service.PresignedUrlService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;
import com.handongapp.cms.domain.enums.ClubUserRole;
import com.handongapp.cms.domain.TbUserClubRole;
import com.handongapp.cms.domain.TbClubRole;
import com.handongapp.cms.repository.TbClubRoleRepository;
import com.handongapp.cms.exception.data.DuplicateEntityException;
import com.handongapp.cms.exception.data.NotFoundException;

@Service
@RequiredArgsConstructor
public class ClubServiceImpl implements ClubService {

    private final ClubRepository clubRepository;
    private final CourseRepository courseRepository;
    private final ClubMapper clubMapper;
    private final ObjectMapper objectMapper;

    private final PresignedUrlService presignedUrlService;
    private final TbUserClubRoleRepository tbUserClubRoleRepository;
    private final TbClubRoleRepository tbClubRoleRepository;

    private static final String DELETED_FLAG_YES = "Y";
    private static final String DELETED_FLAG_NO = "N";

    @Override
    public ClubDto.ClubProfileResDto getClubProfile(String clubSlug) {
        return clubRepository.findBySlugAndDeleted(clubSlug, DELETED_FLAG_NO)
                .map(club -> {
                    String presignedUrl = null;
                    if (StringUtils.hasText(club.getFileKey()) && FileStatus.UPLOADED.equals(club.getFileStatus())) {
                        // Presigned URL 생성
                        presignedUrl = presignedUrlService
                                .generateDownloadUrl(club.getFileKey(), Duration.ofMinutes(60))
                                .toString();
                    }

                    return new ClubDto.ClubProfileResDto(
                            club.getId(),
                            club.getName(),
                            club.getSlug(),
                            club.getDescription(),
                            presignedUrl
                    );
                })
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "클럽을 찾을 수 없습니다: " + clubSlug));
    }

    @Transactional
    @Override
    public void updateClubProfile(String clubSlug, ClubDto.ClubProfileReqDto dto) { //upsert
        Optional<TbClub> existingClubOpt = clubRepository.findBySlugAndDeleted(clubSlug, DELETED_FLAG_NO);
        TbClub clubEntity;

        if (!existingClubOpt.isPresent()) { //insert new club if not found or soft-deleted
            clubEntity = new TbClub();
            clubEntity.setSlug(clubSlug); // Use slug from path for new club

            if (!StringUtils.hasText(dto.getName())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "새 클럽 생성 시 이름은 필수입니다.");
            }
            clubEntity.setName(dto.getName());
            clubEntity.setDescription(dto.getDescription());
            clubEntity.setFileKey(dto.getFileKey());
            clubEntity.setDeleted(DELETED_FLAG_NO);
        } else { //update existing non-deleted club
            clubEntity = existingClubOpt.get();

            // Slug update logic
            if (StringUtils.hasText(dto.getSlug()) && !dto.getSlug().equals(clubEntity.getSlug())) {
                String newSlug = dto.getSlug();
                // Check if new slug conflicts with another non-deleted club
                Optional<TbClub> conflictingClubOpt = clubRepository.findBySlugAndDeleted(newSlug, DELETED_FLAG_NO);
                if (conflictingClubOpt.isPresent() && !conflictingClubOpt.get().getId().equals(clubEntity.getId())) {
                    throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 다른 클럽이 사용중인 Slug입니다: " + newSlug);
                }
                clubEntity.setSlug(newSlug);
            }

            if (dto.getName() != null) {
                if (!StringUtils.hasText(dto.getName())) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "클럽 이름은 비워둘 수 없습니다.");
                }
                clubEntity.setName(dto.getName());
            }

            if (dto.getDescription() != null) {
                clubEntity.setDescription(dto.getDescription());
            }

            if (dto.getFileKey() != null) {
                if (StringUtils.hasText(dto.getFileKey())) {
                    clubEntity.setFileKey(dto.getFileKey());
                } else {
                    clubEntity.setFileKey(null);
                }
            }
        }
        clubRepository.save(clubEntity);
    }

    @Transactional
    @Override
    public ClubDto.ClubProfileResDto createClub(ClubDto.ClubProfileReqDto dto) {
        if (!StringUtils.hasText(dto.getSlug())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "클럽 Slug는 필수입니다.");
        }
        if (!StringUtils.hasText(dto.getName())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "클럽 이름은 필수입니다.");
        }

        clubRepository.findBySlugAndDeleted(dto.getSlug(), DELETED_FLAG_NO).ifPresent(c -> {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 사용중인 클럽 Slug 입니다: " + dto.getSlug());
        });

        TbClub newClub = new TbClub();
        newClub.setName(dto.getName());
        newClub.setSlug(dto.getSlug());
        newClub.setDescription(dto.getDescription());
        newClub.setFileKey(dto.getFileKey());
        newClub.setDeleted(DELETED_FLAG_NO);

        TbClub savedClub = clubRepository.save(newClub);

        return new ClubDto.ClubProfileResDto(
                savedClub.getId(),
                savedClub.getName(),
                savedClub.getSlug(),
                savedClub.getDescription(),
                savedClub.getFileKey()
        );
    }

    @Transactional
    @Override
    public void deleteClub(String clubSlug) {
        TbClub clubToDelete = clubRepository.findBySlugAndDeleted(clubSlug, DELETED_FLAG_NO)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "삭제할 클럽을 찾을 수 없습니다: " + clubSlug));

        clubToDelete.setDeleted(DELETED_FLAG_YES);
        clubRepository.save(clubToDelete);
    }

    @Override
    public String getCoursesByClubSlugAsJson(String clubSlug) {
        // 클럽 존재 여부 검증
        clubRepository.findBySlugAndDeleted(clubSlug, DELETED_FLAG_NO)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "코스 정보를 조회할 클럽을 찾을 수 없습니다: " + clubSlug));

        String rawJson = clubMapper.getCoursesByClubSlugAsJson(clubSlug);

        try {
            JsonNode root = objectMapper.readTree(rawJson);

            if (root.isArray()) {
                // courseId를 먼저 모아둠
                List<String> courseIds = new ArrayList<>();
                for (JsonNode courseNode : root) {
                    String courseId = courseNode.path("id").asText(null);
                    if (StringUtils.hasText(courseId)) {
                        courseIds.add(courseId);
                    }
                }

                // findAllById로 한 번의 쿼리로 모든 코스 조회
                Map<String, TbCourse> courseMap = courseRepository.findAllById(courseIds)
                        .stream()
                        .collect(Collectors.toMap(TbCourse::getId, Function.identity()));

                // 각 노드에서 조회
                for (JsonNode courseNode : root) {
                    String courseId = courseNode.path("id").asText(null);

                    if (StringUtils.hasText(courseId)) {
                        TbCourse course = courseMap.get(courseId);

                        if (course != null &&
                                StringUtils.hasText(course.getFileKey()) &&
                                FileStatus.UPLOADED.equals(course.getFileStatus())) {

                            String presignedUrl = presignedUrlService.generateDownloadUrl(
                                    course.getFileKey(), Duration.ofMinutes(60)).toString();

                            ((ObjectNode) courseNode).put("pictureUrl", presignedUrl);
                        }
                    }
                }
            }

            return objectMapper.writeValueAsString(root);
        } catch (JsonProcessingException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "코스 JSON 파싱/직렬화에 실패했습니다.", e);
        }
    }

    @Override
    public List<ClubDto.ClubListInfoResponseDto> getAllClubs(Authentication authentication) {
        List<TbClub> clubs = clubRepository.findAllByDeleted(DELETED_FLAG_NO);
        String currentUserId = null;

        if (authentication != null && authentication.isAuthenticated()) {
            currentUserId = authentication.getName(); // Assumes getName() returns the String userId
        }

        final String finalCurrentUserId = currentUserId;

        return clubs.stream()
                .map(club -> {
                    String presignedBannerUrl = null;
                    if (StringUtils.hasText(club.getFileKey()) && FileStatus.UPLOADED.equals(club.getFileStatus())) {
                        presignedBannerUrl = presignedUrlService
                                .generateDownloadUrl(club.getFileKey(), Duration.ofMinutes(60))
                                .toString();
                    }

                    Boolean isMember = null;
                    if (finalCurrentUserId != null) {
                        // Only set to true or false if the user is authenticated
                        isMember = tbUserClubRoleRepository.existsByUserIdAndClubIdAndDeleted(
                                finalCurrentUserId, club.getId(), DELETED_FLAG_NO);
                    }

                    return ClubDto.ClubListInfoResponseDto.builder()
                            .id(club.getId())
                            .clubName(club.getName())
                            .slug(club.getSlug())
                            .description(club.getDescription())
                            .bannerUrl(presignedBannerUrl)
                            .isMember(isMember)
                            .build();
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void joinClub(String clubSlug, ClubDto.ClubJoinRequestDto joinRequestDto, Authentication authentication) {
        String currentUserId = authentication.getName(); // 인증된 사용자 ID 가져오기

        // 1. 동아리 유효성 검사 (존재 여부 및 삭제 여부)
        TbClub club = clubRepository.findBySlugAndDeleted(clubSlug, DELETED_FLAG_NO)
                .orElseThrow(() -> new NotFoundException("가입할 동아리를 찾을 수 없습니다: " + clubSlug));

        // 2. 이미 가입되어 있는지 확인 (어떤 역할이든 관계없이)
        boolean alreadyMember = tbUserClubRoleRepository.existsByUserIdAndClubIdAndDeleted(
                currentUserId, club.getId(), DELETED_FLAG_NO
        );

        if (alreadyMember) {
            throw new DuplicateEntityException("이미 해당 동아리에 가입되어 있습니다.");
        }

        // 3. TbUserClubRole에 레코드 추가
        // CLUB_MEMBER 역할 ID 조회
        TbClubRole clubMemberRole = tbClubRoleRepository.findByTypeAndDeleted(ClubUserRole.CLUB_MEMBER, DELETED_FLAG_NO)
                .orElseThrow(() -> new NotFoundException("기본 동아리원 역할(CLUB_MEMBER)을 찾을 수 없습니다. 시스템 설정을 확인해주세요."));

        TbUserClubRole newUserClubRole = TbUserClubRole.of(
                currentUserId,
                club.getId(),
                clubMemberRole.getId(), // 조회한 roleId 사용
                joinRequestDto.getGeneration() // DTO에서 generation 값 사용
        );
        // TbUserClubRole이 AuditingFields를 상속하므로 deleted, createdAt, updatedAt은 자동 관리됨
        tbUserClubRoleRepository.save(newUserClubRole);
    }
}