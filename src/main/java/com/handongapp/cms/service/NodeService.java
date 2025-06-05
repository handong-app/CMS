package com.handongapp.cms.service;

import com.handongapp.cms.dto.v1.NodeDto;

import java.util.List;

public interface NodeService {
    NodeDto.Response create(NodeDto.CreateRequest req);

    NodeDto.Response get(String nodeId);

    List<NodeDto.Response> listByGroup(String nodeGroupId);

    NodeDto.Response update(String nodeId, NodeDto.UpdateRequest req);

    void deleteSoft(String nodeId);

    void updateNodeFileDataToUploading(String nodeId, String fileListId);

    void updateVideoTranscodeStatus(String videoId, String status, Integer progress);
}
