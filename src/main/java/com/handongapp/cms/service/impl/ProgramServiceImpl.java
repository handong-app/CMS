package com.handongapp.cms.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.handongapp.cms.domain.TbClub;
import com.handongapp.cms.domain.TbCourse;
import com.handongapp.cms.domain.TbProgram;
import com.handongapp.cms.domain.TbProgramParticipant;
import com.handongapp.cms.domain.TbProgramCourse;
import com.handongapp.cms.dto.v1.ProgramDto;
import com.handongapp.cms.domain.enums.FileStatus;
import com.handongapp.cms.exception.data.DuplicateEntityException;
import com.handongapp.cms.exception.data.NotFoundException;
import com.handongapp.cms.mapper.ProgramMapper;
import com.handongapp.cms.repository.CourseRepository;
import com.handongapp.cms.repository.ClubRepository;
import com.handongapp.cms.repository.TbProgramCourseRepository;
import com.handongapp.cms.repository.TbProgramParticipantRepository;
import com.handongapp.cms.repository.TbProgramRepository;
import com.handongapp.cms.service.PresignedUrlService;
import com.handongapp.cms.service.ProgramService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

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
    private final TbProgramCourseRepository tbProgramCourseRepository;

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
        String rawJson = programMapper.getProgramParticipantProgressAsJson(clubSlug, programSlug);

        try {
            JsonNode node = objectMapper.readTree(rawJson);  // 여기서 실패하면 예외 catch로 이동
            return objectMapper.writeValueAsString(node);
        } catch (Exception e) {
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

    @Override
    @Transactional
    public ProgramDto.ResponseDto createProgram(String clubSlug, ProgramDto.CreateRequest requestDto, Authentication authentication) {
        String currentUserId = authentication.getName();

        // 1. 클럽 조회
        TbClub club = clubRepository.findBySlugAndDeleted(clubSlug, DELETED_FLAG_NO)
                .orElseThrow(() -> new NotFoundException("클럽을 찾을 수 없습니다: " + clubSlug));

        // 2. 프로그램 슬러그 중복 확인 (같은 클럽 내에서)
        if (tbProgramRepository.existsByClubIdAndSlugAndDeleted(club.getId(), requestDto.getSlug(), DELETED_FLAG_NO)) {
            throw new DuplicateEntityException("이미 사용 중인 프로그램 슬러그입니다: " + requestDto.getSlug());
        }

        // 3. 날짜 유효성 검사 (startDate < endDate)
        if (requestDto.getStartDate().isAfter(requestDto.getEndDate()) || requestDto.getStartDate().isEqual(requestDto.getEndDate())) {
            throw new IllegalArgumentException("프로그램 시작일은 종료일보다 이전이어야 합니다.");
        }

        // 4. 프로그램 엔티티 생성 및 저장
        TbProgram newProgram = requestDto.toEntity(club.getId(), currentUserId);
        TbProgram savedProgram = tbProgramRepository.save(newProgram);

        // 5. ResponseDto로 변환하여 반환
        return ProgramDto.ResponseDto.builder()
                .programId(savedProgram.getId())
                .clubId(savedProgram.getClubId())
                .clubSlug(clubSlug) // clubSlug는 요청에서 받았으므로 그대로 사용
                .userId(savedProgram.getUserId())
                .name(savedProgram.getName())
                .slug(savedProgram.getSlug())
                .description(savedProgram.getDescription())
                .startDate(savedProgram.getStartDate())
                .endDate(savedProgram.getEndDate())
                .build();
    }

    @Override
    @Transactional
    public void addCourseToProgram(String clubSlug, String programSlug, String courseSlug, Authentication authentication) {
        // 1. 클럽 조회
        TbClub club = clubRepository.findBySlugAndDeleted(clubSlug, DELETED_FLAG_NO)
                .orElseThrow(() -> new NotFoundException("클럽을 찾을 수 없습니다: " + clubSlug));
        String clubId = club.getId();

        // 2. 프로그램 조회
        TbProgram program = tbProgramRepository.findByClubIdAndSlugAndDeleted(clubId, programSlug, DELETED_FLAG_NO)
                .orElseThrow(() -> new NotFoundException("프로그램을 찾을 수 없습니다: " + programSlug + " (클럽: " + clubSlug + ")"));
        String programId = program.getId();

        // 3. 코스 조회
        TbCourse course = courseRepository.findByClubIdAndSlugAndDeleted(clubId, courseSlug, DELETED_FLAG_NO)
                .orElseThrow(() -> new NotFoundException("코스를 찾을 수 없습니다: " + courseSlug + " (클럽: " + clubSlug + ")"));
        String courseId = course.getId();

        // 4. 이미 프로그램에 코스가 추가되었는지 확인
        if (tbProgramCourseRepository.existsByProgramIdAndCourseIdAndDeleted(programId, courseId, DELETED_FLAG_NO)) {
            throw new DuplicateEntityException("이미 해당 프로그램에 추가된 코스입니다: " + courseSlug);
        }

        // 5. TbProgramCourse 엔티티 생성 및 저장
        TbProgramCourse newProgramCourse = new TbProgramCourse();
        newProgramCourse.setProgramId(programId);
        newProgramCourse.setCourseId(courseId);
        newProgramCourse.setUserId(authentication.getName());

        tbProgramCourseRepository.save(newProgramCourse);
    }
}
