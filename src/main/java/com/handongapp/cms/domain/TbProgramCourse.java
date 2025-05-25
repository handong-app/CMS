package com.handongapp.cms.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "tb_program_course")
@Getter
@Setter
@NoArgsConstructor
public class TbProgramCourse extends AuditingFields {
    @Column(columnDefinition = "CHAR(32)", nullable = false)
    private String programId;
    @Column(columnDefinition = "CHAR(32)", nullable = false)
    private String userId;
}
