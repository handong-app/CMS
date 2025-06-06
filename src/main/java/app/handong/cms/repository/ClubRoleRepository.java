package app.handong.cms.repository;

import app.handong.cms.domain.TbClubRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClubRoleRepository extends JpaRepository<TbClubRole, String> {
}
