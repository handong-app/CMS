package com.handongapp.cms.mapper;

import org.apache.ibatis.annotations.Param;

public interface NodeMapper {
    String findClubIdByNodeId(@Param("nodeId") String nodeId);
}