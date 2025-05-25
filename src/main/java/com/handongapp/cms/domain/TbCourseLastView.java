package com.example.course.domain;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * <p>TbCourseLastView Entity – records the last node-group a user has viewed
 *   in a given course.</p>
 *
 * <p><b>Design Pattern:</b> Plain Old Java Object, used as a JPA Aggregate Root.</p>
 */
@Entity
@Table(name = "tb_course_last_view")
public class TbCourseLastView extends AuditingFields {

    /** Owner of the record – UUID (CHAR(32)) */
    @Column(name = "user_id",columnDefinition = "char(32)", nullable = false)
    private String userId;

    /** Course identifier (FK → course.id) */
    @Column(name = "course_id",columnDefinition = "char(32)", nullable = false)
    private String courseId;

    /** Last viewed Node-Group */
    @Column(name = "node_group_id",columnDefinition = "char(32)", nullable = false)
    private String nodeGroupId;

}
