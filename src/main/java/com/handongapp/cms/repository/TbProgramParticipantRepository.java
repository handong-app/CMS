package com.handongapp.cms.repository;

import com.handongapp.cms.domain.TbProgramParticipant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TbProgramParticipantRepository extends JpaRepository<TbProgramParticipant, String> {
}
