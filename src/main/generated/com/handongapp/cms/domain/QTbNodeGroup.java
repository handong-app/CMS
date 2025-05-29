package com.handongapp.cms.domain;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QTbNodeGroup is a Querydsl query type for TbNodeGroup
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QTbNodeGroup extends EntityPathBase<TbNodeGroup> {

    private static final long serialVersionUID = 69203171L;

    public static final QTbNodeGroup tbNodeGroup = new QTbNodeGroup("tbNodeGroup");

    public final QAuditingFields _super = new QAuditingFields(this);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    //inherited
    public final StringPath deleted = _super.deleted;

    //inherited
    public final StringPath id = _super.id;

    public final NumberPath<Integer> order = createNumber("order", Integer.class);

    public final StringPath sectionId = createString("sectionId");

    public final StringPath title = createString("title");

    //inherited
    public final DateTimePath<java.time.LocalDateTime> updatedAt = _super.updatedAt;

    public QTbNodeGroup(String variable) {
        super(TbNodeGroup.class, forVariable(variable));
    }

    public QTbNodeGroup(Path<? extends TbNodeGroup> path) {
        super(path.getType(), path.getMetadata());
    }

    public QTbNodeGroup(PathMetadata metadata) {
        super(TbNodeGroup.class, metadata);
    }

}

