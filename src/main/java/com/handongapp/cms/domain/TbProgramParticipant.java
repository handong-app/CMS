package com.handongapp.cms.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "tb_program_participant",
        indexes = {
                @Index(columnList = "deleted")
                , @Index(columnList = "createdAt")
                , @Index(columnList = "updatedAt")
        }
)
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class TbProgramParticipant extends AuditingFields {
    @Column(columnDefinition = "CHAR(32)", nullable = false)
    private String programId;

    @Column(columnDefinition = "CHAR(32)", nullable = false)
    private String userId;

    @Column(columnDefinition = "DATETIME")
    private LocalDateTime invitedAt;
    @Column(columnDefinition = "DATETIME")
    private LocalDateTime acceptedAt;

    // 정적 팩토리 메소드 추가
    public static TbProgramParticipant of(String programId, String userId) {
        TbProgramParticipant participant = new TbProgramParticipant();
        participant.setProgramId(programId);
        participant.setUserId(userId);
        participant.setAcceptedAt(LocalDateTime.now()); // 가입(수락) 시간 설정
        // invitedAt은 이 로직에서는 설정하지 않음 (직접 가입 시나리오)
        // AuditingFields (id, deleted, createdAt, updatedAt)는 JPA에 의해 자동 관리
        return participant;
    }
}
