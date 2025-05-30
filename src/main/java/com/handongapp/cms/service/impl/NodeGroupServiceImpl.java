package com.handongapp.cms.service.impl;

import com.handongapp.cms.domain.TbNodeGroup;
import com.handongapp.cms.dto.v1.NodeGroupDto;
import com.handongapp.cms.repository.NodeGroupRepository;
import com.handongapp.cms.service.NodeGroupService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NodeGroupServiceImpl implements NodeGroupService {

    private final NodeGroupRepository nodeGroupRepository;

    @Override
    @Transactional
    public NodeGroupDto.Response create(NodeGroupDto.CreateRequest req) {
        TbNodeGroup entity = req.toEntity();
        TbNodeGroup savedNodeGroup = nodeGroupRepository.save(entity);
        return NodeGroupDto.Response.from(savedNodeGroup);
    }

    @Override
    @Transactional(readOnly = true)
    public NodeGroupDto.Response get(String id) {
        TbNodeGroup nodeGroup = nodeGroupRepository.findByIdAndDeleted(id, "N")
                .orElseThrow(() -> new EntityNotFoundException("NodeGroup not found with id: " + id));
        return NodeGroupDto.Response.from(nodeGroup);
    }

    @Override
    @Transactional(readOnly = true)
    public List<NodeGroupDto.Response> listBySection(String sectionId) {
        return nodeGroupRepository.findBySectionIdAndDeletedOrderByOrderAsc(sectionId, "N")
                .stream()
                .map(NodeGroupDto.Response::from)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public NodeGroupDto.Response update(String id, NodeGroupDto.UpdateRequest req) {
        TbNodeGroup entity = nodeGroupRepository.findByIdAndDeleted(id, "N")
                .orElseThrow(() -> new EntityNotFoundException("NodeGroup not found with id: " + id));
        req.applyTo(entity);
        return NodeGroupDto.Response.from(entity);
    }

    @Override
    @Transactional
    public void deleteSoft(String id) {
        TbNodeGroup entity = nodeGroupRepository.findByIdAndDeleted(id, "N")
                .orElseThrow(() -> new EntityNotFoundException("NodeGroup not found with id: " + id));
        entity.setDeleted("Y");
    }
}
