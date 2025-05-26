package com.handongapp.cms.repository;

import com.handongapp.cms.domain.TbNode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TbNodeRepository extends JpaRepository<TbNode, String> {
    List<TbNode> findByNodeGroupIdAndDeleted(String nodeGroupId, String deleted);
}
