package com.handongapp.cms.service.impl;

import com.handongapp.cms.domain.TbNode;
import com.handongapp.cms.dto.NodeCreateRequest;
import com.handongapp.cms.dto.NodeResponse;
import com.handongapp.cms.dto.NodeUpdateRequest;
import com.handongapp.cms.dto.mapper.NodeMapper;
import com.handongapp.cms.repository.TbNodeRepository;
import com.handongapp.cms.service.NodeService;
import com.handongapp.cms.service.validator.NodeDataValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class NodeServiceImpl implements NodeService {

    private final TbNodeRepository repo;
    private final NodeMapper mapper;

    @Override
    public NodeResponse create(String nodeGroupId, NodeCreateRequest req) {
        NodeDataValidator.validate(req.type(), req.data());
        TbNode entity = mapper.toEntity(req);
        entity.setNodeGroupId(nodeGroupId);
        if (entity.getCommentPermitted() == null)
            entity.setCommentPermitted(Boolean.TRUE);
        TbNode saved = repo.save(entity);
        return mapper.toDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public NodeResponse get(String id) {
        return mapper.toDto(findActive(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<NodeResponse> listByGroup(String nodeGroupId) {
        return repo.findByNodeGroupIdAndDeleted(nodeGroupId, "N")
                   .stream()
                   .map(mapper::toDto)
                   .toList();
    }

    @Override
    public NodeResponse update(String id, NodeUpdateRequest req) {
        TbNode entity = findActive(id);
        if (req.data() != null)
            NodeDataValidator.validate(entity.getType(), req.data());
        mapper.updateEntityFromDto(req, entity);
        return mapper.toDto(entity);
    }

    @Override
    public void deleteSoft(String id) {
        TbNode entity = findActive(id);
        entity.setDeleted("Y");
    }

    private TbNode findActive(String id) {
        return repo.findById(id)
                .filter(n -> "N".equals(n.getDeleted()))
                .orElseThrow(() -> new IllegalArgumentException("Node not found or deleted: " + id));
    }
}
