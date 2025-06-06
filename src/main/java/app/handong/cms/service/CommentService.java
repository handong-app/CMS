package app.handong.cms.service;

import app.handong.cms.dto.v1.CommentDto;
import app.handong.cms.dto.v1.CommentResponseDto;

import java.util.List;

public interface CommentService {

    CommentDto.Response create(String userId, CommentDto.CreateRequest req);

    CommentDto.Response update(String commentId, String userId, CommentDto.UpdateRequest req);

    void deleteSoft(String commentId, String userId);


    List<CommentResponseDto> searchComments(
            String courseId,
            String courseSlug,
            String courseName,
            String nodeGroupId,
            String filterUserId,
            String username
    );
    
}
