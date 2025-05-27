package com.handongapp.cms.domain;

import com.handongapp.cms.dto.NodeDto;
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

    /** Optional attachment */
    @Lob
    @Column(name = "attachment_url")
    private String attachmentUrl;

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
        QUIZ
    }

    public NodeDto.Response toDto() { 
        return new NodeDto.Response(
                this.getId(), 
                this.nodeGroupId,
                this.type,
                this.commentPermitted,
                this.data,
                this.order,
                this.attachmentUrl,
                this.getCreatedAt(), 
                this.getUpdatedAt()  
        );
    }

    // NodeDto.CreateRequest 로부터 TbNode 엔티티 생성
    public static TbNode fromCreateRequest(NodeDto.CreateRequest request) {
        TbNode node = new TbNode();
        node.setNodeGroupId(request.getNodeGroupId());
        node.setType(request.getType());
        node.setCommentPermitted(request.getCommentPermitted()); 
        node.setData(request.getData());
        node.setOrder(request.getOrder());
        node.setAttachmentUrl(request.getAttachmentUrl());
        // id, deleted, createdAt, updatedAt는 AuditingFields의 @PrePersist 및 JPA에 의해 자동 관리
        return node;
    }

    // NodeDto.UpdateRequest 로부터 TbNode 엔티티 업데이트
    public void updateFromUpdateRequest(NodeDto.UpdateRequest request) {
        if (request.getCommentPermitted() != null) {
            this.setCommentPermitted(request.getCommentPermitted());
        }
        if (request.getData() != null) {
            this.setData(request.getData());
        }
        if (request.getOrder() != null) {
            this.setOrder(request.getOrder());
        }
        if (request.getAttachmentUrl() != null) {
            this.setAttachmentUrl(request.getAttachmentUrl());
        }
        // createdAt, updatedAt는 AuditingFields의 @LastModifiedDate 및 JPA에 의해 자동 관리
    }
}
