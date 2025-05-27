package com.handongapp.cms.service.impl;

import com.handongapp.cms.domain.TbNode;
import com.handongapp.cms.dto.NodeDto;
import com.handongapp.cms.repository.TbNodeRepository;
import com.handongapp.cms.service.NodeService;
import com.handongapp.cms.service.validator.NodeDataValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NodeServiceImpl implements NodeService {

    private final TbNodeRepository tbNodeRepository;

    @Override
    @Transactional
    public NodeDto.Response create(NodeDto.CreateRequest req) {
        NodeDataValidator.validate(req.getType(), req.getData());
        TbNode entity = TbNode.fromCreateRequest(req);
        TbNode savedNode = tbNodeRepository.save(entity);
        return savedNode.toDto();
    }

    @Override
    @Transactional(readOnly = true)
    public NodeDto.Response get(String nodeId) {
        TbNode node = tbNodeRepository.findByIdAndDeleted(nodeId, "N")
                .orElseThrow(() -> new EntityNotFoundException("Node not found with id: " + nodeId));
        return node.toDto();
    }

    @Override
    @Transactional(readOnly = true)
    public List<NodeDto.Response> listByGroup(String nodeGroupId) {
        return tbNodeRepository.findByNodeGroupIdAndDeletedOrderByOrderAsc(nodeGroupId, "N")
                .stream()
                .map(TbNode::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public NodeDto.Response update(String nodeId, NodeDto.UpdateRequest req) {
        TbNode entity = tbNodeRepository.findByIdAndDeleted(nodeId, "N")
                .orElseThrow(() -> new EntityNotFoundException("Node not found with id: " + nodeId));
        if (req.getData() != null) {
            NodeDataValidator.validate(entity.getType(), req.getData());
        }
        entity.updateFromUpdateRequest(req);
        return entity.toDto();
    }

    @Override
    @Transactional
    public void deleteSoft(String nodeId) {
        TbNode entity = tbNodeRepository.findByIdAndDeleted(nodeId, "N")
                .orElseThrow(() -> new EntityNotFoundException("Node not found with id: " + nodeId));
        entity.setDeleted("Y");
    }
}
