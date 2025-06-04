package com.handongapp.cms.service;

import com.handongapp.cms.dto.v1.CommentDto;

import java.util.List;

public interface CommentService {

    CommentDto.Response create(String userId, CommentDto.CreateRequest req);

    CommentDto.Response update(String commentId, String userId, CommentDto.UpdateRequest req);

    void deleteSoft(String commentId, String userId);


    List<CommentDto.CommentResponseWithNameDto> searchComments(
            String courseId,
            String courseSlug,
            String courseName,
            String nodeGroupId,
            String filterUserId,
            String username
    );
    
}
