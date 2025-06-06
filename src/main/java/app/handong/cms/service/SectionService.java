package app.handong.cms.service;

import app.handong.cms.dto.v1.SectionDto;
import java.util.List;

public interface SectionService {
    SectionDto.Response create(String courseId, SectionDto.CreateRequest req);
    SectionDto.Response get(String id);
    List<SectionDto.Response> listByCourse(String courseId);
    SectionDto.Response update(String id, SectionDto.UpdateRequest req);
    void deleteSoft(String id);
}
