package com.example.course.domain;

import jakarta.persistence.*;

/**
 * <p>TbCommentCategory Entity – per-course configurable set of comment
 *   categories (slug, i18n label, emoji).</p>
 *
 * <p><b>Design Pattern:</b> Reference Data / Lookup Table.</p>
 */
@Entity
@Table(name = "tb_comment_category")
public class TbCommentCategory extends AuditingFields {

    /** FK → course.id (BIGINT) */
    @Column(name = "course_id", nullable = false)
    private String courseId;

    /** URL-friendly unique key */
    @Column(length = 100, nullable = false)
    private String slug;

    /** Localized display name */
    @Column(length = 64)
    private String label;

    /** Emoji code-point(s) – max 10 chars */
    @Column(length = 10)
    private String emoji;
}
