package com.handongapp.cms.service.impl;

import com.handongapp.cms.domain.TbCourseLastView;
import com.handongapp.cms.domain.TbProgramProgress;
import com.handongapp.cms.domain.enums.ProgramProgressState;
import com.handongapp.cms.dto.ProgressDto;
import com.handongapp.cms.exception.data.DataUpdateException;
import com.handongapp.cms.exception.data.NotFoundException;
import com.handongapp.cms.repository.CourseLastViewRepository;
import com.handongapp.cms.repository.NodeGroupRepository;
import com.handongapp.cms.repository.ProgramProgressRepository;
import com.handongapp.cms.repository.UserRepository;
import com.handongapp.cms.service.ProgressService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
@Service
public class ProgressServiceImpl implements ProgressService {

    private final UserRepository userRepository;
    private final NodeGroupRepository nodeGroupRepository;
    private final ProgramProgressRepository programProgressRepository;
    private final CourseLastViewRepository courseLastViewRepository;
    
    @Override
    @Transactional
    public ProgressDto.Response startProgress(String userId, ProgressDto.Request request) {
        return processProgress(userId, request, ProgramProgressState.IN_PROGRESS);
    }

    @Override
    @Transactional
    public ProgressDto.Response endProgress(String userId, ProgressDto.Request request) {
        return processProgress(userId, request, ProgramProgressState.DONE);
    }
    
    private ProgressDto.Response processProgress(String userId, ProgressDto.Request request, ProgramProgressState state) {
        String nodeGroupId = request.getNodeGroupId();
        
        // 1. 사용자와 노드그룹 유효성 확인
        userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("사용자를 찾을 수 없습니다."));

        nodeGroupRepository.findByIdAndDeleted(nodeGroupId, "N")
                .orElseThrow(() -> new NotFoundException("노드그룹을 찾을 수 없습니다."));
        
        // 노드그룹이 속한 코스 ID 조회
        String courseId = nodeGroupRepository.findCourseIdByNodeGroupId(nodeGroupId, "N")
                .orElseThrow(() -> new NotFoundException("해당 노드그룹이 속한 코스를 찾을 수 없습니다."));
        
        // 코스 마지막 조회 정보 업데이트
        updateCourseLastView(userId, courseId, nodeGroupId);
        
        // 2. 노드그룹이 속한 코스와 사용자가 참가한 프로그램에 속한 코스 중 일치하는 것 확인
        // 프로그램의 시작일과 종료일 사이에 있는지도 확인
        String programId = programProgressRepository.findValidProgramIdByCourseIdAndUserId(
                        courseId, userId, "N")
                .orElseThrow(() -> new NotFoundException("사용자가 참여 중인 유효한 프로그램에서 해당 코스를 찾을 수 없습니다."));
        
        // 3. 이미 같은 데이터가 있는지 확인하고, 없으면 삽입
        TbProgramProgress progress = programProgressRepository
                .findByUserIdAndProgramIdAndNodeGroupIdAndDeleted(userId, programId, nodeGroupId, "N")
                .orElseGet(() -> {
                    // 새로운 프로그램 진행 엔티티 생성
                    TbProgramProgress newProgress = new TbProgramProgress();
                    // ID는 AuditingFields의 @PrePersist에서 자동 생성됨
                    newProgress.setUserId(userId);
                    newProgress.setProgramId(programId);
                    newProgress.setNodeGroupId(nodeGroupId);
                    newProgress.setDeleted("N");
                    return newProgress;
                });
        
        // 상태 업데이트
        if (progress.getState() == null || progress.getState() == ProgramProgressState.IN_PROGRESS) {
            progress.setState(state);
        }
        progress.setLastSeenAt(LocalDateTime.now());
        
        try {
            progress = programProgressRepository.save(progress);
            
            // 응답 구성
            return ProgressDto.Response.builder()
                    .id(progress.getId())
                    .nodeGroupId(progress.getNodeGroupId())
                    .userId(progress.getUserId())
                    .programId(progress.getProgramId())
                    .state(progress.getState().name())
                    .message("진행 상태가 업데이트 되었습니다.")
                    .build();
        } catch (Exception e) {
            log.error("진행 상태 업데이트 중 오류 발생", e);
            throw new DataUpdateException("진행 상태 업데이트 실패: " + e.getMessage());
        }
    }

    private void updateCourseLastView(String userId, String courseId, String nodeGroupId) {
        try {
            // 기존 레코드 조회
            Optional<TbCourseLastView> existingView = courseLastViewRepository
                    .findByUserIdAndCourseIdAndDeleted(userId, courseId, "N");
            
            TbCourseLastView courseLastView;
            
            if (existingView.isPresent()) {
                // 기존 레코드 업데이트
                courseLastView = existingView.get();
                courseLastView.setNodeGroupId(nodeGroupId);
            } else {
                // 새 레코드 생성
                courseLastView = new TbCourseLastView();
                courseLastView.setUserId(userId);
                courseLastView.setCourseId(courseId);
                courseLastView.setNodeGroupId(nodeGroupId);
                courseLastView.setDeleted("N");
            }
            
            courseLastViewRepository.save(courseLastView);
            log.debug("코스 마지막 조회 정보 업데이트 완료: userId={}, courseId={}, nodeGroupId={}", 
                    userId, courseId, nodeGroupId);
        } catch (Exception e) {
            log.error("코스 마지막 조회 정보 업데이트 중 오류 발생: {}", e.getMessage(), e);
            throw e;
        }
    }
}
