// dto/NodeCreateRequest.java
package com.handongapp.cms.dto;

import com.handongapp.cms.domain.TbNode;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.Map;

public record NodeCreateRequest(
        @NotBlank String nodeGroupId,
        @NotNull TbNode.NodeType type,
        Boolean commentPermitted,
        Map<String, Object> data,
        Integer order,
        String attachmentUrl
) {}
