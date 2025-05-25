package com.handongapp.cms.domain;

import com.handongapp.cms.domain.enums.ProgramProgressState;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;

@Entity
@Table(name = "tb_program_progress")
@Getter
@Setter
@NoArgsConstructor
public class TbProgramProgress extends AuditingFields {
    @Column(columnDefinition = "CHAR(32)", nullable = false)
    private String programId;
    @Column(columnDefinition = "CHAR(32)", nullable = false)
    private String nodeGroupId;
    @Column(columnDefinition = "CHAR(32)", nullable = false)
    private String userId;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private ProgramProgressState state;

    private LocalDateTime lastSeenAt;
}

