package com.handongapp.cms.repository;

import com.handongapp.cms.domain.TbFileList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FileListRepository extends JpaRepository<TbFileList, String> {
    List<TbFileList> findByNodeId(String nodeId);
}
