package com.handongapp.cms.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "tb_file_list",
        indexes = {
                @Index(columnList = "userId"),
                @Index(columnList = "nodeId"),
                @Index(columnList = "isUploadComplete"),
                @Index(columnList = "deleted"),
                @Index(columnList = "createdAt")
        }
)
public class TbFileList extends AuditingFields {
    @Column(name = "user_id", columnDefinition = "CHAR(32)", nullable = false)
    private String userId;

    @Column(name = "club_id", columnDefinition = "CHAR(32)")
    private String clubId;

    @Column(name = "node_id", columnDefinition = "CHAR(32)", nullable = false)
    private String nodeId;

    @Column(name = "file_key", length = 255, nullable = false)
    private String fileKey;

    @Column(name = "original_file_name", length = 255)
    private String originalFileName;

    @Column(name = "content_type", length = 255, nullable = false)
    private String contentType;

    @Builder.Default
    @Column(name = "is_upload_complete", columnDefinition = "BIT", nullable = false)
    private Boolean isUploadComplete = false;

    @Column(name = "requested_at", nullable = false, columnDefinition = "DATETIME(6)")
    private LocalDateTime requestedAt = LocalDateTime.now();

    @Column(name = "completed_at", columnDefinition = "DATETIME(6)")
    private LocalDateTime completedAt;
}