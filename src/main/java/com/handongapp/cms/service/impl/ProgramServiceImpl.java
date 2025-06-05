package com.handongapp.cms.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.handongapp.cms.domain.TbClub;
import com.handongapp.cms.domain.TbCourse;
import com.handongapp.cms.domain.TbProgram;
import com.handongapp.cms.domain.TbProgramParticipant;
import com.handongapp.cms.domain.enums.FileStatus;
import com.handongapp.cms.exception.data.DuplicateEntityException;
import com.handongapp.cms.exception.data.NotFoundException;
import com.handongapp.cms.mapper.ProgramMapper;
import com.handongapp.cms.repository.CourseRepository;
import com.handongapp.cms.repository.ClubRepository;
import com.handongapp.cms.repository.TbProgramParticipantRepository;
import com.handongapp.cms.repository.TbProgramRepository;
import com.handongapp.cms.service.PresignedUrlService;
import com.handongapp.cms.service.ProgramService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

import java.time.Duration;
import java.time.LocalDateTime; // 현재 시간 비교를 위해 추가

@Service
@RequiredArgsConstructor
public class ProgramServiceImpl implements ProgramService {

    private final ProgramMapper programMapper;
    private final ObjectMapper objectMapper;

    private final CourseRepository courseRepository;
    private final PresignedUrlService presignedUrlService;

    // 추가된 Repository
    private final ClubRepository clubRepository;
    private final TbProgramRepository tbProgramRepository;
    private final TbProgramParticipantRepository tbProgramParticipantRepository;

    // 상수 추가 (AuditingFields.deleted가 String "N" 타입이라고 가정)
    private static final String DELETED_FLAG_NO = "N";

    @Override
    @Transactional(readOnly = true)
    public String getProgramDetailsWithCoursesAsJson(String clubSlug, String programSlug) {
        String rawJson = programMapper.getProgramDetailsWithCoursesAsJson(clubSlug, programSlug);

        try {
            JsonNode root = objectMapper.readTree(rawJson);

            if (root.isObject() && root.has("courses") && root.get("courses").isArray()) {
                for (JsonNode courseNode : root.get("courses")) {
                    String courseId = courseNode.path("id").asText(null);
                    if (StringUtils.hasText(courseId)) {
                        TbCourse course = courseRepository.findById(courseId)
                                .orElse(null);

                        if (course != null && StringUtils.hasText(course.getFileKey())
                                && FileStatus.UPLOADED.equals(course.getFileStatus())) {
                            String presignedUrl = presignedUrlService
                                    .generateDownloadUrl(course.getFileKey(), Duration.ofMinutes(60))
                                    .toString();

                            ((ObjectNode) courseNode).put("pictureUrl", presignedUrl);
                        }
                    }
                }
            }

            return objectMapper.writeValueAsString(root);
        } catch (Exception e) {
            throw new IllegalStateException("프로그램 JSON 파싱/직렬화에 실패했습니다.", e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public String getProgramsWithCoursesByClubSlugAsJson(String clubSlug) {
        String rawJson = programMapper.getProgramsWithCoursesByClubSlugAsJson(clubSlug);

        try {
            JsonNode node = objectMapper.readTree(rawJson);  // 여기서 실패하면 예외 catch로 이동
            return objectMapper.writeValueAsString(node);
        } catch (Exception e) {
            throw new IllegalStateException("프로그램 JSON 파싱/직렬화에 실패했습니다.", e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public String getProgramParticipantProgressAsJson(String clubSlug, String programSlug) {
        // 존재 여부 검증
        if (!clubRepository.existsBySlugAndDeleted(clubSlug, "N")) {
            throw new NotFoundException("존재하지 않는 클럽입니다: " + clubSlug);
        }
        if (!tbProgramRepository.existsBySlugAndDeleted(programSlug, "N")) {
            throw new NotFoundException("존재하지 않는 프로그램입니다: " + programSlug);
        }

        String rawJson = programMapper.getProgramParticipantProgressAsJson(clubSlug, programSlug);

        if (!StringUtils.hasText(rawJson) || "null".equals(rawJson)) {
            throw new NotFoundException("참가자 진행 정보가 없습니다: " + programSlug);
        }

        try {
            JsonNode node = objectMapper.readTree(rawJson);
            return objectMapper.writeValueAsString(node);
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("프로그램 JSON 파싱/직렬화에 실패했습니다.", e);
        }
    }

    @Override
    @Transactional
    public void joinProgram(String clubSlug, String programSlug, Authentication authentication) {
        String currentUserId = authentication.getName();
        LocalDateTime now = LocalDateTime.now(); // 현재 시간

        // 1. 클럽 조회
        TbClub club = clubRepository.findBySlugAndDeleted(clubSlug, DELETED_FLAG_NO)
                .orElseThrow(() -> new NotFoundException("클럽을 찾을 수 없습니다: " + clubSlug));

        // 2. 프로그램 조회
        TbProgram program = tbProgramRepository.findByClubIdAndSlugAndDeleted(club.getId(), programSlug, DELETED_FLAG_NO)
                .orElseThrow(() -> new NotFoundException("프로그램을 찾을 수 없습니다: " + programSlug + " (클럽: " + clubSlug + ")"));

        // 3. 프로그램 진행 기간 확인
        // TbProgram의 startDate, endDate는 nullable=false 이므로 null 체크는 불필요
        if (now.isBefore(program.getStartDate())) {
            throw new IllegalStateException("아직 프로그램 시작 전입니다. 시작일: " + program.getStartDate());
        }
        if (now.isAfter(program.getEndDate())) {
            throw new IllegalStateException("이미 프로그램이 종료되었습니다. 종료일: " + program.getEndDate());
        }

        // 4. 이미 참여했는지 확인
        boolean alreadyParticipant = tbProgramParticipantRepository.existsByUserIdAndProgramIdAndDeleted(
                currentUserId, program.getId(), DELETED_FLAG_NO
        );

        if (alreadyParticipant) {
            throw new DuplicateEntityException("이미 해당 프로그램에 참여하고 있습니다.");
        }

        // 5. 프로그램 참여자로 등록
        TbProgramParticipant newParticipant = TbProgramParticipant.of(program.getId(), currentUserId);
        tbProgramParticipantRepository.save(newParticipant);
    }
}
