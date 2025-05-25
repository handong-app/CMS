package com.handongapp.cms.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "tb_program_participant")
@Getter
@Setter
@NoArgsConstructor
public class TbProgramParticipant extends AuditingFields {

    private Integer programId;

    @Column(length = 32)
    private String userId;

    private LocalDateTime invitedAt;
    private LocalDateTime acceptedAt;
}
