package com.example.course.domain;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * <p>TbNodeGroup Entity – logical grouping of Nodes inside a Course Section.</p>
 *
 * <p><b>Design Pattern:</b> Composite pattern (NodeGroup is the composite,
 *   Node is the leaf).</p>
 */
@Entity
@Table(name = "tb_node_group")
public class TbNodeGroup extends AuditingFields {

    /** Parent Section (UUID) */
    @Column(name = "section_id", length = 32, nullable = false)
    private String sectionId;

    @Column(length = 32, nullable = false)
    private String title;

    /** Explicit sort order */
    @Column(name = "`order`")
    private Integer order;
}
