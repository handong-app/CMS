package com.handongapp.cms.domain;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QTbComment is a Querydsl query type for TbComment
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QTbComment extends EntityPathBase<TbComment> {

    private static final long serialVersionUID = 1754477349L;

    public static final QTbComment tbComment = new QTbComment("tbComment");

    public final QAuditingFields _super = new QAuditingFields(this);

    public final StringPath categoryId = createString("categoryId");

    public final StringPath content = createString("content");

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    //inherited
    public final StringPath deleted = _super.deleted;

    //inherited
    public final StringPath id = _super.id;

    public final BooleanPath nodeDeleted = createBoolean("nodeDeleted");

    public final StringPath targetId = createString("targetId");

    //inherited
    public final DateTimePath<java.time.LocalDateTime> updatedAt = _super.updatedAt;

    public final StringPath userId = createString("userId");

    public QTbComment(String variable) {
        super(TbComment.class, forVariable(variable));
    }

    public QTbComment(Path<? extends TbComment> path) {
        super(path.getType(), path.getMetadata());
    }

    public QTbComment(PathMetadata metadata) {
        super(TbComment.class, metadata);
    }

}

