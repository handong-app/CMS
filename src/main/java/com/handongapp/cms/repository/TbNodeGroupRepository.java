package com.handongapp.cms.repository;

import com.handongapp.cms.domain.TbNodeGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TbNodeGroupRepository extends JpaRepository<TbNodeGroup, String> {
}
