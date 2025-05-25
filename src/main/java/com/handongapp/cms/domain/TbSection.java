package com.handongapp.cms.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "tb_section")
@Getter
@Setter
@NoArgsConstructor
public class TbSection extends AuditingFields {
    @Column(columnDefinition = "CHAR(32)", nullable = false)
    private String courseId;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "`order`")
    private Integer order;
}