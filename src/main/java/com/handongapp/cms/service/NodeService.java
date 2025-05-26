package com.handongapp.cms.service;

import com.handongapp.cms.dto.NodeCreateRequest;
import com.handongapp.cms.dto.NodeResponse;
import com.handongapp.cms.dto.NodeUpdateRequest;

import java.util.List;

public interface NodeService {
    NodeResponse create(String nodeGroupId, NodeCreateRequest req);
    NodeResponse get(String nodeId);
    List<NodeResponse> listByGroup(String nodeGroupId);
    NodeResponse update(String nodeId, NodeUpdateRequest req);
    void deleteSoft(String nodeId);
}
