package app.handong.cms.repository;

import app.handong.cms.domain.TbUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<TbUser, String> {
    Optional<TbUser> findByEmail(String email);

    Optional<TbUser> findById(String Id);
    Optional<TbUser> findByGoogleSub(String GoogleSub);
}