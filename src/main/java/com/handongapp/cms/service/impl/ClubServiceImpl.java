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
import com.handongapp.cms.service.ClubService;
import com.handongapp.cms.service.PresignedUrlService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

import java.time.Duration;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ClubServiceImpl implements ClubService {

    private final ClubRepository clubRepository;
    private final CourseRepository courseRepository;
    private final ClubMapper clubMapper;
    private final ObjectMapper objectMapper;

    private final PresignedUrlService presignedUrlService;

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
        clubRepository.findBySlugAndDeleted(clubSlug, DELETED_FLAG_NO)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "코스 정보를 조회할 클럽을 찾을 수 없습니다: " + clubSlug));

        String rawJson = clubMapper.getCoursesByClubSlugAsJson(clubSlug);

        try {
            JsonNode root = objectMapper.readTree(rawJson);

            if (root.isArray()) {
                for (JsonNode courseNode : root) {
                    String courseId = courseNode.path("id").asText(null);

                    if (StringUtils.hasText(courseId)) {
                        TbCourse course = courseRepository.findById(courseId)
                                .orElse(null);

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
}
