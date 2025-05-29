package com.handongapp.cms.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * <p>TbNodeGroup Entity – logical grouping of Nodes inside a Course Section.</p>
 *
 * <p><b>Design Pattern:</b> Composite pattern (NodeGroup is the composite,
 *   Node is the leaf).</p>
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "tb_node_group",
        indexes = {
                @Index(columnList = "deleted")
                , @Index(columnList = "createdAt")
                , @Index(columnList = "updatedAt")
        }
)
public class TbNodeGroup extends AuditingFields {

    /** Parent Section (UUID) */
    @Column(name = "section_id",columnDefinition = "char(32)", nullable = false)
    private String sectionId;

    @Column(columnDefinition = "varchar(30)", nullable = false)
    private String title;
    /** Explicit sort order */
    @Column(name = "`order`")
    private Integer order;
}
