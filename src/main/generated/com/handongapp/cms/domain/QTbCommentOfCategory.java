package com.handongapp.cms.domain;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QTbCommentOfCategory is a Querydsl query type for TbCommentOfCategory
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QTbCommentOfCategory extends EntityPathBase<TbCommentOfCategory> {

    private static final long serialVersionUID = -1639412486L;

    public static final QTbCommentOfCategory tbCommentOfCategory = new QTbCommentOfCategory("tbCommentOfCategory");

    public final QAuditingFields _super = new QAuditingFields(this);

    public final StringPath courseId = createString("courseId");

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    //inherited
    public final StringPath deleted = _super.deleted;

    public final StringPath emoji = createString("emoji");

    //inherited
    public final StringPath id = _super.id;

    public final StringPath label = createString("label");

    public final StringPath slug = createString("slug");

    //inherited
    public final DateTimePath<java.time.LocalDateTime> updatedAt = _super.updatedAt;

    public QTbCommentOfCategory(String variable) {
        super(TbCommentOfCategory.class, forVariable(variable));
    }

    public QTbCommentOfCategory(Path<? extends TbCommentOfCategory> path) {
        super(path.getType(), path.getMetadata());
    }

    public QTbCommentOfCategory(PathMetadata metadata) {
        super(TbCommentOfCategory.class, metadata);
    }

}

