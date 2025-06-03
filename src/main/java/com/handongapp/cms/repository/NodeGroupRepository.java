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

    @Query("SELECT ng FROM TbNodeGroup ng WHERE ng.sectionId = :sectionId AND ng.deleted = 'N' AND ng.order > :currentOrder ORDER BY ng.order ASC LIMIT 1")
    Optional<TbNodeGroup> findNextInSameSection(@Param("sectionId") String sectionId, @Param("currentOrder") int currentOrder);

    @Query("SELECT ng FROM TbNodeGroup ng WHERE ng.sectionId = :sectionId AND ng.deleted = 'N' ORDER BY ng.order ASC LIMIT 1")
    Optional<TbNodeGroup> findFirstInNextSection(@Param("sectionId") String sectionId);
    
    /**
     * 노드그룹 ID로 해당 노드그룹이 속한 코스 ID를 조회
     * 
     * @param nodeGroupId 노드그룹 ID
     * @param deleted 삭제 여부
     * @return 코스 ID
     */
    @Query(value = 
        "SELECT c.id FROM tb_course c " +
        "JOIN tb_section s ON c.id = s.course_id AND s.deleted = :deleted " +
        "JOIN tb_node_group ng ON s.id = ng.section_id AND ng.deleted = :deleted " +
        "WHERE ng.id = :nodeGroupId AND c.deleted = :deleted", nativeQuery = true)
    Optional<String> findCourseIdByNodeGroupId(
        @Param("nodeGroupId") String nodeGroupId, 
        @Param("deleted") String deleted);
}
