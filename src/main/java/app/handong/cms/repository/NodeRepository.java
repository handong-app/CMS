package app.handong.cms.repository;

import app.handong.cms.domain.TbNode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface NodeRepository extends JpaRepository<TbNode, String> {
    Optional<TbNode> findByIdAndDeleted(String id, String deleted);

    List<TbNode> findByNodeGroupIdAndDeletedOrderByOrderAsc(String nodeGroupId, String deleted);
}
