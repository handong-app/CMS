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

    @Column(name = "course_id", columnDefinition = "CHAR(32)")
    private String courseId;

    @Column(name = "node_id", columnDefinition = "CHAR(32)")
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
    private LocalDateTime requestedAt;

    @Column(name = "completed_at", columnDefinition = "DATETIME(6)")
    private LocalDateTime completedAt;


    /**
     * Note: 이 @PrePersist 메서드는 상위 클래스 AuditingFields의 onPrePersist()와 함께 호출됩니다.
     * 둘 다 존재해도 JPA 스펙 상 정상 동작하나, IDE 에서 중복 정의로 경고(빨간줄)를 띄울 수 있습니다.
     * 이는 무시해도 무방하며, requestedAt 초기화를 위해 의도적으로 작성된 메서드입니다.
     */
    @PrePersist
    protected void onCreate() {
        if (requestedAt == null) {
            requestedAt = LocalDateTime.now();
        }
    }
}