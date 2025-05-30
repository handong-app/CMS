package com.handongapp.cms.service;

import com.handongapp.cms.dto.v1.NodeGroupDto;
import java.util.List;

public interface NodeGroupService {
    NodeGroupDto.Response create(NodeGroupDto.CreateRequest req);
    NodeGroupDto.Response get(String id);
    List<NodeGroupDto.Response> listBySection(String sectionId);
    NodeGroupDto.Response update(String id, NodeGroupDto.UpdateRequest req);
    void deleteSoft(String id);
}
