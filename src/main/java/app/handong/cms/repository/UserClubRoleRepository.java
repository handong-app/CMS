package app.handong.cms.repository;

import app.handong.cms.domain.TbUserClubRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserClubRoleRepository extends JpaRepository<TbUserClubRole, String> {
    Optional<TbUserClubRole> findByUserIdAndClubIdAndDeleted(String userId, String clubId, String deleted);
}
