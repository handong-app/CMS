package com.handongapp.cms.service.impl;

import com.handongapp.cms.domain.TbSection;
import com.handongapp.cms.dto.v1.SectionDto;
import com.handongapp.cms.repository.SectionRepository;
import com.handongapp.cms.service.SectionService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.lang.Nullable;

@Service
@RequiredArgsConstructor
public class SectionServiceImpl implements SectionService {

    private final SectionRepository sectionRepository;

    @Override
    @Transactional
    public SectionDto.Response create(String courseId, SectionDto.CreateRequest req) {
        TbSection newSection = req.toEntity(courseId); // Assumes toEntity sets order from req
        TbSection persistedSection = reorderAndPersist(courseId, newSection, newSection.getOrder());
        return SectionDto.Response.from(persistedSection);
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
        TbSection entityToUpdate = sectionRepository.findByIdAndDeleted(id, "N")
                .orElseThrow(() -> new EntityNotFoundException("Section not found with id: " + id));
        
        String courseId = entityToUpdate.getCourseId();
        
        // Apply changes from DTO. Assumes req.applyTo updates entityToUpdate.order if req.getOrder() is not null.
        req.applyTo(entityToUpdate);
        
        // entityToUpdate.getOrder() will be the requested new order if specified in DTO, or original order if not.
        TbSection updatedEntity = reorderAndPersist(courseId, entityToUpdate, entityToUpdate.getOrder());
        return SectionDto.Response.from(updatedEntity);
    }

    @Override
    @Transactional
    public void deleteSoft(String id) {
        TbSection entity = sectionRepository.findByIdAndDeleted(id, "N")
                .orElseThrow(() -> new EntityNotFoundException("Section not found with id: " + id));
        
        String courseId = entity.getCourseId();
        entity.setDeleted("Y");
        entity.setOrder(null); // Mark order as irrelevant for soft-deleted items
        sectionRepository.save(entity); // Persist the soft deletion

        // Reorder remaining active sections
        reorderAndPersist(courseId, null, null);
    }

    private TbSection reorderAndPersist(String courseId, @Nullable TbSection targetSection, @Nullable Integer requestedOrderForTarget) {
        List<TbSection> currentSectionsInDb = sectionRepository.findByCourseIdAndDeletedOrderByOrderAsc(courseId, "N");

        List<TbSection> sectionsToProcess = new ArrayList<>();
        boolean isTargetNew = (targetSection != null && targetSection.getId() == null);

        // Populate sectionsToProcess with existing sections, excluding the targetSection if it's being updated
        for (TbSection s : currentSectionsInDb) {
            if (targetSection != null && s.getId() != null && s.getId().equals(targetSection.getId()) && !isTargetNew) {
                // Skip the old version of targetSection if it's an update of an existing entity
                continue;
            }
            sectionsToProcess.add(s);
        }

        // If targetSection is provided (create or update), add it to the list at the correct position
        // Keep a reference to return, as the instance in targetSection variable might be the one from DB
        // or a new one. The one added to sectionsToProcess is what gets its ID populated if new.
        TbSection sectionToReturn = targetSection; 

        if (targetSection != null) {
            int insertionIndex;
            Integer effectiveOrder = requestedOrderForTarget;

            // If no order is specified in the request for an existing item,
            // use its current order to maintain its relative position unless other items shift it.
            if (effectiveOrder == null) {
                if (!isTargetNew) { // Existing item, order not specified in update DTO
                    effectiveOrder = targetSection.getOrder(); // Use its current order for placement logic
                }
                // If still null (e.g., new item and DTO order was null), it will be appended.
            }

            if (effectiveOrder == null) {
                 insertionIndex = sectionsToProcess.size(); // Append to the end
            } else {
                // Ensure insertionIndex is within the bounds of [0, sectionsToProcess.size()]
                insertionIndex = Math.max(0, Math.min(effectiveOrder, sectionsToProcess.size()));
            }
            sectionsToProcess.add(insertionIndex, targetSection);
        }

        // Re-assign sequential order values from 0 to the items in sectionsToProcess
        for (int i = 0; i < sectionsToProcess.size(); i++) {
            TbSection section = sectionsToProcess.get(i);
            section.setOrder(i);
        }

        if (!sectionsToProcess.isEmpty()) {
            sectionRepository.saveAll(sectionsToProcess); // Use sectionsToProcess directly
        }
        
        // If targetSection was new, its ID is populated by saveAll.
        // The 'sectionToReturn' (which is the 'targetSection' object passed in or created)
        // is the instance that was added to sectionsToProcess and subsequently saved.
        // So it should have the ID if it was new.
        return sectionToReturn;
    }
}
