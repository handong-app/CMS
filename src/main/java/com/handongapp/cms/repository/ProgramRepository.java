package com.handongapp.cms.repository;

import com.handongapp.cms.domain.TbProgram;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProgramRepository extends JpaRepository<TbProgram, String> {
}
