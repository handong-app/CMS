package com.handongapp.cms.domain;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QTbCourseLastView is a Querydsl query type for TbCourseLastView
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QTbCourseLastView extends EntityPathBase<TbCourseLastView> {

    private static final long serialVersionUID = 570421264L;

    public static final QTbCourseLastView tbCourseLastView = new QTbCourseLastView("tbCourseLastView");

    public final QAuditingFields _super = new QAuditingFields(this);

    public final StringPath courseId = createString("courseId");

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    //inherited
    public final StringPath deleted = _super.deleted;

    //inherited
    public final StringPath id = _super.id;

    public final StringPath nodeGroupId = createString("nodeGroupId");

    //inherited
    public final DateTimePath<java.time.LocalDateTime> updatedAt = _super.updatedAt;

    public final StringPath userId = createString("userId");

    public QTbCourseLastView(String variable) {
        super(TbCourseLastView.class, forVariable(variable));
    }

    public QTbCourseLastView(Path<? extends TbCourseLastView> path) {
        super(path.getType(), path.getMetadata());
    }

    public QTbCourseLastView(PathMetadata metadata) {
        super(TbCourseLastView.class, metadata);
    }

}

