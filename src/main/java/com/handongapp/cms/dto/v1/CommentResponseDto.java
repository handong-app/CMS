package com.handongapp.cms.dto.v1;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class CommentResponseDto {
    private final String id;
    private final String targetId;
    private final String userId;
    private final String userName;
    private final String categoryId;
    private final String content;
    private final LocalDateTime createdAt;
    private final LocalDateTime updatedAt;

}
