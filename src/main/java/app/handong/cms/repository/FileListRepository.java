package app.handong.cms.repository;

import app.handong.cms.domain.TbFileList;
import jakarta.persistence.LockModeType;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FileListRepository extends JpaRepository<TbFileList, String> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT f FROM TbFileList f WHERE f.nodeId = :nodeId")
    List<TbFileList> findByNodeIdForUpdate(@Param("nodeId") String nodeId);
}
