package com.handongapp.cms.service;

import com.handongapp.cms.dto.v1.SectionDto;
import java.util.List;

public interface SectionService {
    SectionDto.Response create(String courseId, SectionDto.CreateRequest req);
    SectionDto.Response get(String id);
    List<SectionDto.Response> listByCourse(String courseId);
    SectionDto.Response update(String id, SectionDto.UpdateRequest req);
    void deleteSoft(String id);
}
