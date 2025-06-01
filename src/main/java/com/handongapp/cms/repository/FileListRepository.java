package com.handongapp.cms.repository;

import com.handongapp.cms.domain.TbFileList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface FileListRepository extends JpaRepository<TbFileList, String> {
    Optional<TbFileList> findByFileKey(String fileKey);
    List<TbFileList> findByFileKeyStartingWith(String prefix);
}
