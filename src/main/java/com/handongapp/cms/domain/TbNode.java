package com.handongapp.cms.domain;

import com.vladmihalcea.hibernate.type.json.JsonStringType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Type;
import java.util.Map;

/**
 * <p>TbNode Entity – single learning object (text, image, video, quiz…).</p>
 *
 * <p><b>Design Pattern:</b> Leaf of the Composite (NodeGroup).</p>
 */
@Getter 
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "tb_node",
        indexes = {
                @Index(columnList = "deleted")
                , @Index(columnList = "createdAt")
                , @Index(columnList = "updatedAt")
        }
)
public class TbNode extends AuditingFields {

    /** Owning group */
    @Column(name = "node_group_id",columnDefinition = "char(32)", nullable = false)
    private String nodeGroupId;

    /** Position inside the group */
    @Column(name = "`order`")
    private Integer order;

    /** Node content type */
    @Enumerated(EnumType.STRING)
    private NodeType type;

    /** Whether comments are allowed for this node */
    @Column(name = "is_comment_permitted")
    private Boolean commentPermitted = Boolean.FALSE;

    /** Arbitrary JSON payload – requires hibernate-types dependency */
    @Type(JsonStringType.class)
    @Column(columnDefinition = "json")
    private Map<String, Object> data;


    public enum NodeType {
        TEXT,
        IMAGE,
        VIDEO,
        FILE,
        QUIZ
    }
}
