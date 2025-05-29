package com.handongapp.cms.repository;

import com.handongapp.cms.domain.TbProgramProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProgramProgressRepository extends JpaRepository<TbProgramProgress, String> {
}
