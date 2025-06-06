package app.handong.cms.domain;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * <p>TbComment Entity – user-generated comment bound to a Node.</p>
 *
 * <p><b>Design Pattern:</b> Aggregate Leaf of <i>Course</i>, managed via a Repository.</p>
 */
@Entity
@Table(name = "tb_comment",
        indexes = {
                @Index(columnList = "deleted")
                , @Index(columnList = "createdAt")
                , @Index(columnList = "updatedAt")
        }
)
@Getter
@Setter
@NoArgsConstructor
public class TbComment extends AuditingFields {

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
