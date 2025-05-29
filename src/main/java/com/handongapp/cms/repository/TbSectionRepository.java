package com.handongapp.cms.repository;

import com.handongapp.cms.domain.TbSection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface TbSectionRepository extends JpaRepository<TbSection, String> {
    Optional<TbSection> findByIdAndDeleted(String id, String deleted);
    List<TbSection> findByCourseIdAndDeletedOrderByOrderAsc(String courseId, String deleted);
}
