package com.handongapp.cms.repository;

import com.handongapp.cms.domain.TbFileList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface FileListRepository extends JpaRepository<TbFileList, String> {
}
