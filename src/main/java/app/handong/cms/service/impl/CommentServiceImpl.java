package app.handong.cms.service.impl;

import app.handong.cms.domain.TbComment;
import app.handong.cms.dto.v1.CommentDto;
import app.handong.cms.dto.v1.CommentResponseDto;
import app.handong.cms.repository.CommentRepository;
import app.handong.cms.mapper.CustomQueryMapper;
import app.handong.cms.service.CommentService;
import app.handong.cms.exception.data.NotFoundException;
import app.handong.cms.exception.auth.NoAuthorizationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Stream;

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
                .orElseThrow(() -> new NotFoundException("수정할 댓글을 찾을 수 없습니다. ID: " + commentId));

        if (!entity.getUserId().equals(userId)) {
            throw new NoAuthorizationException("댓글을 수정할 권한이 없습니다.");
        }

        req.applyTo(entity);
        return CommentDto.Response.from(entity);
    }

    @Override
    @Transactional
    public void deleteSoft(String commentId, String userId) {
        TbComment entity = commentRepository.findByIdAndDeleted(commentId, DELETED_STATUS_NO)
                .orElseThrow(() -> new NotFoundException("삭제할 댓글을 찾을 수 없습니다. ID: " + commentId));

        if (!entity.getUserId().equals(userId)) {
            throw new NoAuthorizationException("댓글을 삭제할 권한이 없습니다.");
        }

        entity.setDeleted(DELETED_STATUS_YES);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CommentResponseDto> searchComments(
            String courseId,
            String courseSlug,
            String courseName,
            String nodeGroupId,
            String filterUserId,
            String username
    ) {
        validateInputParameters(nodeGroupId, courseId, courseSlug, courseName, filterUserId, username);

        String resolvedUserId = resolveUserId(filterUserId, username);
        List<String> targetIdsForQuery;

        if (isNotEmpty(nodeGroupId)) {
            targetIdsForQuery = resolveTargetIdsByNodeGroup(nodeGroupId);
        } else {
            String resolvedCourseId = resolveCourseId(courseId, courseSlug, courseName);
            targetIdsForQuery = resolveTargetIds(resolvedCourseId);
        }

        return commentRepository.findCommentsByCriteria(targetIdsForQuery, resolvedUserId, DELETED_STATUS_NO);
    }

    private void validateInputParameters(String nodeGroupId, String courseId, String courseSlug, String courseName, String filterUserId, String username) {
        if (isNotEmpty(nodeGroupId)) {
            if (isNotEmpty(courseId) || isNotEmpty(courseSlug) || isNotEmpty(courseName)) {
                throwIllegalArgumentException("nodeGroupId가 제공된 경우 course 필터(courseId, courseSlug, courseName)를 사용할 수 없습니다.");
            }
        } else {
            validateCourseParams(courseId, courseSlug, courseName);
        }
        validateUserParams(filterUserId, username);
    }

    private void validateCourseParams(String courseId, String courseSlug, String courseName) {
        int courseParamsProvided = countNonEmptyParams(courseId, courseSlug, courseName);
        if (courseParamsProvided > 1) {
            throwIllegalArgumentException("courseId, courseSlug, courseName 중 하나만 입력해주세요.");
        }
    }

    private void validateUserParams(String filterUserId, String username) {
        int userParamsProvided = countNonEmptyParams(filterUserId, username);
        if (userParamsProvided > 1) {
            throwIllegalArgumentException("filterUserId, username 중 하나만 입력해주세요.");
        }
    }

    private int countNonEmptyParams(String... params) {
        return (int) Stream.of(params)
                .filter(param -> param != null && !param.trim().isEmpty())
                .count();
    }

    private void throwIllegalArgumentException(String message) {
        log.error(message);
        throw new IllegalArgumentException(message);
    }

    private String resolveCourseId(String courseId, String courseSlug, String courseName) {
        if (isNotEmpty(courseId)) return courseId;
        if (isNotEmpty(courseSlug)) return findCourseIdBySlug(courseSlug);
        if (isNotEmpty(courseName)) return findCourseIdByName(courseName);
        return null;
    }

    private String resolveUserId(String filterUserId, String username) {
        if (isNotEmpty(filterUserId)) return filterUserId;
        if (isNotEmpty(username)) return findUserIdByUsername(username);
        return null;
    }

    private boolean isNotEmpty(String str) {
        return str != null && !str.trim().isEmpty();
    }

    private String findCourseIdBySlug(String slug) {
        String courseId = customQueryMapper.findCourseIdBySlug(slug);
        if (courseId == null) {
            throwNotFoundException("다음 slug에 해당하는 코스를 찾을 수 없습니다: " + slug);
        }
        return courseId;
    }

    private String findCourseIdByName(String name) {
        String courseId = customQueryMapper.findCourseIdByName(name);
        if (courseId == null) {
            throwNotFoundException("다음 이름에 해당하는 코스를 찾을 수 없습니다: " + name);
        }
        return courseId;
    }

    private String findUserIdByUsername(String username) {
        String userId = customQueryMapper.findUserIdByUsername(username);
        if (userId == null) {
            throwNotFoundException("다음 사용자 이름에 해당하는 사용자를 찾을 수 없습니다: " + username);
        }
        return userId;
    }

    private void throwNotFoundException(String message) {
        log.error(message);
        throw new NotFoundException(message);
    }

    private List<String> resolveTargetIds(String courseId) {
        return isNotEmpty(courseId) ? customQueryMapper.findTargetIdsByCourseId(courseId) : null;
    }
    
    private List<String> resolveTargetIdsByNodeGroup(String nodeGroupId) {
        return isNotEmpty(nodeGroupId) ? customQueryMapper.findTargetIdsByNodeGroupId(nodeGroupId) : null;
    }

    
}
