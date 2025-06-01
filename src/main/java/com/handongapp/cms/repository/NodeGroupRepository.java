package com.handongapp.cms.repository;

import com.handongapp.cms.domain.TbNodeGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface NodeGroupRepository extends JpaRepository<TbNodeGroup, String> {
    Optional<TbNodeGroup> findByIdAndDeleted(String id, String deleted);
    List<TbNodeGroup> findBySectionIdAndDeletedOrderByOrderAsc(String sectionId, String deleted);

    @Query(value = "SELECT ng FROM TbNodeGroup ng WHERE ng.sectionId = :sectionId AND ng.deleted = 'N' AND ng.order > :currentOrder ORDER BY ng.order ASC LIMIT 1",nativeQuery = true)
    Optional<TbNodeGroup> findNextInSameSection(@Param("sectionId") String sectionId, @Param("currentOrder") int currentOrder);

    @Query(value = "SELECT ng FROM TbNodeGroup ng WHERE ng.sectionId = :sectionId AND ng.deleted = 'N' ORDER BY ng.order ASC LIMIT 1",nativeQuery = true)
    Optional<TbNodeGroup> findFirstInNextSection(@Param("sectionId") String sectionId);
}
