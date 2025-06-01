package com.handongapp.cms.mapper;

import com.handongapp.cms.domain.TbNode;
import org.apache.ibatis.annotations.Param;

public interface NodeMapper {
    /**
     * 노드 ID로 클럽ID를 조회
     */
    String findClubIdByNodeId(@Param("nodeId") String nodeId);

    /**
     * 노드 ID로 타입을 조회
     */
    TbNode.NodeType findNodeTypeById(@Param("nodeId") String nodeId);

    /**
     * 노드 ID로 data를 갱신
     */
    void updateNodeData(@Param("nodeId") String nodeId, @Param("data") String dataJson);
}