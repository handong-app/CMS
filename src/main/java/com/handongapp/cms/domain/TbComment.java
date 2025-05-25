package com.example.course.domain;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * <p>TbComment Entity – user-generated comment bound to a Node.</p>
 *
 * <p><b>Design Pattern:</b> Aggregate Leaf of <i>Course</i>, managed via a Repository.</p>
 */
@Entity
@Table(name = "tb_comment")
public class TbComment extends AuditingFields{

    /** Author – UUID */
    @Column(name = "user_id",columnDefinition = "char(32)", nullable = false)
    private String userId;

    /** Indicates the target node has been deleted (soft-delete flag) */
    @Column(name = "is_node_deleted")
    private Boolean nodeDeleted;

    /** Target Node (either a Node or, in special cases, a NodeGroup) */
    @Column(name = "target_id",columnDefinition = "char(32)", nullable = false)
    private String targetId;

    /** Comment category (emoji label etc.) */
    @Column(name = "category_id",columnDefinition = "char(32)", nullable = false)
    private String categoryId;

    @Lob
    private String content;
}
