// dto/NodeResponse.java
package com.handongapp.cms.dto;

import com.handongapp.cms.domain.TbNode;
import java.time.LocalDateTime;
import java.util.Map;

public record NodeResponse(
        String id,
        String nodeGroupId,
        TbNode.NodeType type,
        Boolean commentPermitted,
        Map<String, Object> data,
        Integer order,
        String attachmentUrl,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}