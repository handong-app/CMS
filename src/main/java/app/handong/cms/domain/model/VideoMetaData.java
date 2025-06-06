package app.handong.cms.domain.model;

import app.handong.cms.domain.enums.VideoStatus;
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
    private Integer progress;
}