package com.handongapp.cms.domain;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QTbCourse is a Querydsl query type for TbCourse
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QTbCourse extends EntityPathBase<TbCourse> {

    private static final long serialVersionUID = -774444395L;

    public static final QTbCourse tbCourse = new QTbCourse("tbCourse");

    public final QAuditingFields _super = new QAuditingFields(this);

    public final StringPath clubId = createString("clubId");

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    //inherited
    public final StringPath deleted = _super.deleted;

    public final StringPath description = createString("description");

    //inherited
    public final StringPath id = _super.id;

    public final BooleanPath isVisible = createBoolean("isVisible");

    public final StringPath pictureUrl = createString("pictureUrl");

    public final StringPath slug = createString("slug");

    public final StringPath title = createString("title");

    //inherited
    public final DateTimePath<java.time.LocalDateTime> updatedAt = _super.updatedAt;

    public final StringPath userId = createString("userId");

    public QTbCourse(String variable) {
        super(TbCourse.class, forVariable(variable));
    }

    public QTbCourse(Path<? extends TbCourse> path) {
        super(path.getType(), path.getMetadata());
    }

    public QTbCourse(PathMetadata metadata) {
        super(TbCourse.class, metadata);
    }

}

