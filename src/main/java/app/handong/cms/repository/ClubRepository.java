package app.handong.cms.repository;

import app.handong.cms.domain.TbClub;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClubRepository extends JpaRepository<TbClub, String> {
    Optional<TbClub> findBySlug(String clubSlug);
    Optional<TbClub> findBySlugAndDeleted(String clubSlug, String deleted);
    boolean existsBySlugAndDeleted(String clubSlug, String deleted);
    List<TbClub> findAllByDeleted(String deleted);
}
