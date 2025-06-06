package com.handongapp.cms.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.handongapp.cms.domain.*;
import com.handongapp.cms.domain.enums.FileStatus;
import com.handongapp.cms.exception.data.DuplicateEntityException;
import com.handongapp.cms.exception.data.NotFoundException;
import com.handongapp.cms.mapper.ProgramMapper;
import com.handongapp.cms.repository.*;
import com.handongapp.cms.service.PresignedUrlService;
import com.handongapp.cms.service.ProgramService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.Duration;
import java.time.LocalDateTime; // 현재 시간 비교를 위해 추가
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProgramServiceImpl implements ProgramService {

    private final ProgramMapper programMapper;
    private final ObjectMapper objectMapper;

    private final CourseRepository courseRepository;
    private final PresignedUrlService presignedUrlService;

    private final UserRepository userRepository;
    private final ClubRepository clubRepository;
    private final TbProgramRepository tbProgramRepository;
    private final TbProgramParticipantRepository tbProgramParticipantRepository;

    private static final String DELETED_FLAG_NO = "N";

    /**
     * 클럽 슬러그와 프로그램 슬러그로 프로그램 상세 및 코스 정보를 JSON으로 반환합니다.
     * 각 코스의 {@code pictureUrl}을 presigned URL로 채웁니다.
     *
     * @param clubSlug   클럽 슬러그
     * @param programSlug 프로그램 슬러그
     * @return JSON 문자열 (프로그램 상세 정보)
     * @throws IllegalStateException JSON 파싱/직렬화 실패 시 발생
     */
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

    /**
     * 클럽의 프로그램 및 코스 목록을 JSON으로 반환합니다.
     *
     * @param clubSlug 클럽 슬러그
     * @return JSON 문자열 (프로그램 목록)
     * @throws IllegalStateException JSON 파싱/직렬화 실패 시 발생
     */
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

    /**
     * 지정된 클럽과 프로그램의 참가자 진행 상태를 JSON 형식으로 반환합니다.
     * <p>
     * 반환되는 JSON의 각 참가자(participant)의 {@code participantPictureUrl} 필드가,
     * 해당 유저의 {@code fileKey}와 {@code fileStatus}가 UPLOADED 상태일 경우
     * Presigned URL로 치환됩니다.
     * </p>
     *
     * @param clubSlug   클럽 식별자 (slug)
     * @param programSlug 프로그램 식별자 (slug)
     * @return 참가자 진행 상태를 포함하는 JSON 문자열
     * @throws NotFoundException           클럽, 프로그램, 참가자 진행 정보가 없을 경우 발생
     * @throws IllegalStateException       JSON 파싱/직렬화 실패 시 발생
     */
    @Override
    @Transactional(readOnly = true)
    public String getProgramParticipantProgressAsJson(String clubSlug, String programSlug) {
        String clubId = clubRepository.findBySlugAndDeleted(clubSlug, "N")
                .orElseThrow(() -> new NotFoundException("존재하지 않는 클럽입니다: " + clubSlug))
                .getId();

        if (!tbProgramRepository.existsByClubIdAndSlugAndDeleted(clubId, programSlug, "N")) {
            throw new NotFoundException("존재하지 않는 프로그램입니다: " + programSlug);
        }

        String rawJson = programMapper.getProgramParticipantProgressAsJson(clubSlug, programSlug);
        if (!StringUtils.hasText(rawJson) || "null".equals(rawJson)) {
            throw new NotFoundException("참가자 진행 정보가 없습니다: " + programSlug);
        }

        try {
            JsonNode root = objectMapper.readTree(rawJson);
            JsonNode participants = root.path("participants");

            List<String> userIds = new ArrayList<>();
            if (participants.isArray()) {
                for (JsonNode participantNode : participants) {
                    String userId = participantNode.path("userId").asText(null);
                    if (StringUtils.hasText(userId)) {
                        userIds.add(userId);
                    }
                }
            }

            Map<String, TbUser> userMap = userRepository.findAllById(userIds)
                    .stream()
                    .collect(Collectors.toMap(TbUser::getId, Function.identity()));

            if (participants.isArray()) {
                for (JsonNode participantNode : participants) {
                    String userId = participantNode.path("userId").asText(null);

                    if (StringUtils.hasText(userId)) {
                        TbUser user = userMap.get(userId);
                        if (user != null &&
                                StringUtils.hasText(user.getFileKey()) &&
                                FileStatus.UPLOADED.equals(user.getFileStatus())) {

                            String presignedUrl = presignedUrlService
                                    .generateDownloadUrl(user.getFileKey(), Duration.ofMinutes(60))
                                    .toString();

                            ((ObjectNode) participantNode).put("participantPictureUrl", presignedUrl);
                        }
                    }
                }
            }

            return objectMapper.writeValueAsString(root);
        } catch (Exception e) {
            throw new IllegalStateException("프로그램 JSON 파싱/직렬화에 실패했습니다.", e);
        }
    }

    /**
     * 인증 사용자가 프로그램에 참여 요청을 수행합니다.
     * <ul>
     *     <li>프로그램 기간 확인</li>
     *     <li>이미 참여 여부 확인</li>
     *     <li>참여자 등록</li>
     * </ul>
     *
     * @param clubSlug       클럽 슬러그
     * @param programSlug    프로그램 슬러그
     * @param authentication 인증 정보
     * @throws NotFoundException        클럽, 프로그램이 존재하지 않을 경우
     * @throws IllegalStateException    프로그램 기간이 유효하지 않을 경우
     * @throws DuplicateEntityException 이미 참여 중인 경우
     */
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
