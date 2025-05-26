// dto/NodeUpdateRequest.java
package com.handongapp.cms.dto;

import java.util.Map;

public record NodeUpdateRequest(
        Boolean commentPermitted,
        Map<String, Object> data,
        Integer order,
        String attachmentUrl
) {}
