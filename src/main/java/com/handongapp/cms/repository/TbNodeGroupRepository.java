package com.handongapp.cms.repository;

import com.handongapp.cms.domain.TbNodeGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface TbNodeGroupRepository extends JpaRepository<TbNodeGroup, String> {
    Optional<TbNodeGroup> findByIdAndDeleted(String id, String deleted);
    List<TbNodeGroup> findBySectionIdAndDeletedOrderByOrderAsc(String sectionId, String deleted);
}


