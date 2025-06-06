package app.handong.cms.domain;

import app.handong.cms.domain.enums.FileStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "tb_course",
        indexes = {
                @Index(columnList = "deleted")
                , @Index(columnList = "createdAt")
                , @Index(columnList = "updatedAt")
        }
)
@Getter
@Setter
@NoArgsConstructor
public class TbCourse extends AuditingFields {
    @Column(columnDefinition = "CHAR(32)", nullable = false)
    private String clubId;

    @Column(columnDefinition = "CHAR(32)", nullable = false)
    private String userId;

    @Column(nullable = false)
    private String title;

    @Column(length = 100)
    private String slug;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT TRUE")
    private boolean isVisible = true;

    @Column(name = "file_key", length = 255, nullable = true)
    private String fileKey;

    @Enumerated(EnumType.STRING) private FileStatus fileStatus;
}