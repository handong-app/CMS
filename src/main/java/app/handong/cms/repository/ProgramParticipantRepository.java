package app.handong.cms.repository;

import app.handong.cms.domain.TbProgramParticipant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProgramParticipantRepository extends JpaRepository<TbProgramParticipant, String> {
}
