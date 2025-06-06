package com.handongapp.cms.service.impl;

import com.handongapp.cms.domain.TbSection;
import com.handongapp.cms.dto.v1.SectionDto;
import com.handongapp.cms.repository.SectionRepository;
import com.handongapp.cms.service.SectionService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SectionServiceImpl implements SectionService {

    private final SectionRepository sectionRepository;

    @Override
    @Transactional
    public SectionDto.Response create(String courseId, SectionDto.CreateRequest req) {
        TbSection entity = req.toEntity(courseId);
        TbSection savedSection = sectionRepository.save(entity);
        return SectionDto.Response.from(savedSection);
    }

    @Override
    @Transactional(readOnly = true)
    public SectionDto.Response get(String id) {
        TbSection section = sectionRepository.findByIdAndDeleted(id, "N")
                .orElseThrow(() -> new EntityNotFoundException("Section not found with id: " + id));
        return SectionDto.Response.from(section);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SectionDto.Response> listByCourse(String courseId) {
        return sectionRepository.findByCourseIdAndDeletedOrderByOrderAsc(courseId, "N")
                .stream()
                .map(SectionDto.Response::from)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public SectionDto.Response update(String id, SectionDto.UpdateRequest req) {
        TbSection entity = sectionRepository.findByIdAndDeleted(id, "N")
                .orElseThrow(() -> new EntityNotFoundException("Section not found with id: " + id));
        req.applyTo(entity);
        return SectionDto.Response.from(entity);
    }

    @Override
    @Transactional
    public void deleteSoft(String id) {
        TbSection entity = sectionRepository.findByIdAndDeleted(id, "N")
                .orElseThrow(() -> new EntityNotFoundException("Section not found with id: " + id));
        entity.setDeleted("Y");
    }
}
