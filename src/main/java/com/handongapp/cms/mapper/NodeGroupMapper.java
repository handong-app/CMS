package com.handongapp.cms.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface NodeGroupMapper {
    String fetchAllInfoByNodeGroupId(@Param("nodeGroupId") String nodeGroupId);
}
