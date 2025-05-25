package com.example.course.domain;

import com.vladmihalcea.hibernate.type.json.JsonBinaryType;
import jakarta.persistence.*;
import org.hibernate.annotations.Type;
import java.util.Map;

/**
 * <p>TbNode Entity – single learning object (text, image, video, quiz…).</p>
 *
 * <p><b>Design Pattern:</b> Leaf of the Composite (NodeGroup).</p>
 */
@Entity
@Table(name = "tb_node")
public class TbNode extends AuditingFields {

    /** Owning group */
    @Column(name = "node_group_id")
    private String nodeGroupId;

    /** Position inside the group */
    @Column(name = "`order`")
    private Integer order;

    /** Node content type */
    @Enumerated(EnumType.STRING)
    private NodeType type;

    /** Optional attachment */
    @Lob
    @Column(name = "attachment_url")
    private String attachmentUrl;

    /** Whether comments are allowed for this node */
    @Column(name = "is_comment_permitted")
    private Boolean commentPermitted = Boolean.FALSE;

    /** Arbitrary JSON payload – requires hibernate-types dependency */
    @Type(JsonBinaryType.class)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> data;
}

/**
 * Enumerates the supported node types.
 */
public enum NodeType {
    TEXT,
    IMAGE,
    VIDEO,
    QUIZ
}