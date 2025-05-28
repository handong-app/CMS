package com.handongapp.cms.repository;

import com.handongapp.cms.domain.TbNode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface NodeRepository extends JpaRepository<TbNode, String> {
    List<TbNode> findByNodeGroupIdAndDeleted(String nodeGroupId, String deleted);

    Optional<TbNode> findByIdAndDeleted(String id, String deleted);

    List<TbNode> findByNodeGroupIdAndDeletedOrderByOrderAsc(String nodeGroupId, String deleted);
}
