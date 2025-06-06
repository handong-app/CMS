package app.handong.cms.repository;

import app.handong.cms.domain.TbClubRole;
import app.handong.cms.domain.enums.ClubUserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TbClubRoleRepository extends JpaRepository<TbClubRole, String> { // ID 타입은 String으로 가정 (AuditingFields)
    Optional<TbClubRole> findByTypeAndDeleted(ClubUserRole type, String deleted);
}
