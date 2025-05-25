package com.handongapp.cms.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Entity
@NoArgsConstructor
@Table(name="tb_program",
        indexes = {
                @Index(columnList = "deleted")
                , @Index(columnList = "createdAt")
                , @Index(columnList = "updatedAt")
        }
)
public class TbProgram extends AuditingFields {

    @Column(name = "club_id", columnDefinition = "CHAR(32)", nullable = false) @Setter @NotBlank
    private String clubId;

    @Column(name = "user_id", columnDefinition = "CHAR(32)", nullable = false) @Setter @NotBlank
    private String userId;

    @Column(length = 120) @Setter private String name;

    @Column(length = 100) @Setter private String slug;

    @Column(columnDefinition = "TEXT") @Setter private String description;

    @Column(name = "start_date", nullable = false) @Setter private LocalDateTime startDate;

    @Column(name = "end_date", nullable = false) @Setter private LocalDateTime endDate;

}

