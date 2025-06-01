package com.handongapp.cms.domain.model;

import com.handongapp.cms.domain.enums.VideoStatus;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VideoMetaData {
    private String path;
    private String originalFileName;
    private VideoStatus status;
    private String contentType;
}