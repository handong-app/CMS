package com.handongapp.cms.domain;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QTbProgramCourse is a Querydsl query type for TbProgramCourse
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QTbProgramCourse extends EntityPathBase<TbProgramCourse> {

    private static final long serialVersionUID = -593817595L;

    public static final QTbProgramCourse tbProgramCourse = new QTbProgramCourse("tbProgramCourse");

    public final QAuditingFields _super = new QAuditingFields(this);

    public final StringPath courseId = createString("courseId");

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    //inherited
    public final StringPath deleted = _super.deleted;

    //inherited
    public final StringPath id = _super.id;

    public final StringPath programId = createString("programId");

    //inherited
    public final DateTimePath<java.time.LocalDateTime> updatedAt = _super.updatedAt;

    public QTbProgramCourse(String variable) {
        super(TbProgramCourse.class, forVariable(variable));
    }

    public QTbProgramCourse(Path<? extends TbProgramCourse> path) {
        super(path.getType(), path.getMetadata());
    }

    public QTbProgramCourse(PathMetadata metadata) {
        super(TbProgramCourse.class, metadata);
    }

}

