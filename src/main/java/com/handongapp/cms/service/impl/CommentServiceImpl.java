package com.handongapp.cms.service.impl;

import com.handongapp.cms.domain.TbComment;
import com.handongapp.cms.dto.v1.CommentDto;
import com.handongapp.cms.repository.CommentRepository;
import com.handongapp.cms.mapper.CustomQueryMapper;
import com.handongapp.cms.service.CommentService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CommentServiceImpl implements CommentService {

    private final CustomQueryMapper customQueryMapper;

    private final CommentRepository commentRepository;
    private static final String DELETED_STATUS_NO = "N";
    private static final String DELETED_STATUS_YES = "Y";

    @Override
    @Transactional
    public CommentDto.Response create(String userId, CommentDto.CreateRequest req) {
        // todo userId로 요청하는 targetid (nodeId가 속한 course가 속한 clubmember 인지 확인, 아닌 경우엔 exception)

        TbComment entity = req.toEntity(userId);
        TbComment savedComment = commentRepository.save(entity);
        return CommentDto.Response.from(savedComment);
    }

    @Override
    @Transactional
    public CommentDto.Response update(String commentId, String userId, CommentDto.UpdateRequest req) {
        TbComment entity = commentRepository.findByIdAndDeleted(commentId, DELETED_STATUS_NO)
                .orElseThrow(() -> new EntityNotFoundException("수정할 댓글을 찾을 수 없습니다. ID: " + commentId));

        if (!entity.getUserId().equals(userId)) {
            throw new RuntimeException("댓글을 수정할 권한이 없습니다.");
        }

        req.applyTo(entity);
        return CommentDto.Response.from(entity);
    }

    @Override
    @Transactional
    public void deleteSoft(String commentId, String userId) {
        TbComment entity = commentRepository.findByIdAndDeleted(commentId, DELETED_STATUS_NO)
                .orElseThrow(() -> new EntityNotFoundException("삭제할 댓글을 찾을 수 없습니다. ID: " + commentId));

        if (!entity.getUserId().equals(userId)) {
            throw new RuntimeException("댓글을 삭제할 권한이 없습니다.");
        }

        entity.setDeleted(DELETED_STATUS_YES);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CommentDto.Response> searchComments(
            String courseId,
            String courseSlug,
            String courseName,
            String filterUserId,
            String username
    ) {

        // 1. 코스 파라미터 유효성 검사
        int courseParamsProvided = 0;
        if (courseId != null && !courseId.trim().isEmpty()) courseParamsProvided++;
        if (courseSlug != null && !courseSlug.trim().isEmpty()) courseParamsProvided++;
        if (courseName != null && !courseName.trim().isEmpty()) courseParamsProvided++;
        
        if (courseParamsProvided > 1) {
            String errorMsg = "courseId, courseSlug, courseName 중 하나만 입력해주세요.";
            log.error(errorMsg);
            throw new IllegalArgumentException(errorMsg);
        }
        
        // 2. 사용자 파라미터 유효성 검사
        int userParamsProvided = 0;
        if (filterUserId != null && !filterUserId.trim().isEmpty()) userParamsProvided++;
        if (username != null && !username.trim().isEmpty()) userParamsProvided++;
        
        if (userParamsProvided > 1) {
            String errorMsg = "filterUserId, username 중 하나만 입력해주세요.";
            log.error(errorMsg);
            throw new IllegalArgumentException(errorMsg);
        }
        
        // 3. 코스 ID 해석
        String resolvedCourseId = null;
        if (courseId != null && !courseId.trim().isEmpty()) {
            resolvedCourseId = courseId;
        } else if (courseSlug != null && !courseSlug.trim().isEmpty()) {
            resolvedCourseId = customQueryMapper.findCourseIdBySlug(courseSlug);
            if (resolvedCourseId == null) {
                String errorMsg = "다음 slug에 해당하는 코스를 찾을 수 없습니다: " + courseSlug;
                log.error(errorMsg);
                throw new EntityNotFoundException(errorMsg);
            }
        } else if (courseName != null && !courseName.trim().isEmpty()) {
            resolvedCourseId = customQueryMapper.findCourseIdByName(courseName);
            if (resolvedCourseId == null) {
                String errorMsg = "다음 이름에 해당하는 코스를 찾을 수 없습니다: " + courseName;
                log.error(errorMsg);
                throw new EntityNotFoundException(errorMsg);
            }
        }
        
        // 4. 코스 대상 ID(targetIds) 조회
        List<String> targetIdsForQuery = null;
        if (resolvedCourseId != null && !resolvedCourseId.isEmpty()) {
            targetIdsForQuery = customQueryMapper.findTargetIdsByCourseId(resolvedCourseId);
        }

        // 5. 사용자 ID 해석
        String resolvedUserId = null;
        if (filterUserId != null && !filterUserId.trim().isEmpty()) {
            resolvedUserId = filterUserId;
        } else if (username != null && !username.trim().isEmpty()) {
            resolvedUserId = customQueryMapper.findUserIdByUsername(username);
            if (resolvedUserId == null) {
                String errorMsg = "다음 사용자 이름에 해당하는 사용자를 찾을 수 없습니다: " + username;
                log.error(errorMsg);
                throw new EntityNotFoundException(errorMsg);
            }
        } 
        
        // deleted 상태는 'N'을 사용 (삭제되지 않은 상태)
        List<TbComment> comments = commentRepository.findCommentsByCriteria(targetIdsForQuery, resolvedUserId, "N");
        
        // 7. DTO 변환 및 반환
        List<CommentDto.Response> responseDtos = comments.stream()
                .map(CommentDto.Response::from)
                .collect(Collectors.toList());
        
        return responseDtos;
    }
}
