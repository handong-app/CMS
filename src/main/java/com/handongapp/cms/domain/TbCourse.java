package com.handongapp.cms.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "tb_course")
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
    private boolean isVisible;

    @Column(columnDefinition = "TEXT")
    private String pictureUrl;
}