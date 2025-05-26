// mapper/NodeMapper.java
package com.handongapp.cms.dto.mapper;

import com.handongapp.cms.domain.TbNode;
import com.handongapp.cms.dto.*;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface NodeMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "deleted", constant = "N")
    TbNode toEntity(NodeCreateRequest req);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDto(NodeUpdateRequest req, @MappingTarget TbNode entity);

    NodeResponse toDto(TbNode entity);
}