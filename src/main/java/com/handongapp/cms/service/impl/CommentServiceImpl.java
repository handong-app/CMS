package com.handongapp.cms.service.impl;

import com.handongapp.cms.domain.TbComment;
import com.handongapp.cms.dto.v1.CommentDto;
import com.handongapp.cms.repository.CommentRepository;
import com.handongapp.cms.service.CommentService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private static final String DELETED_STATUS_NO = "N";
    private static final String DELETED_STATUS_YES = "Y";

    @Override
    @Transactional
    public CommentDto.Response create(String targetId, String userId, CommentDto.CreateRequest req) {
        TbComment entity = req.toEntity(targetId, userId);
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
    public List<CommentDto.Response> listByTarget(String targetId) {
        return commentRepository.findByTargetIdAndDeleted(targetId, DELETED_STATUS_NO)
                .stream()
                .map(CommentDto.Response::from)
                .collect(Collectors.toList());
    }
}
