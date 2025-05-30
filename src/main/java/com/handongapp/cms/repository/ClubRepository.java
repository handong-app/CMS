package com.handongapp.cms.repository;

import com.handongapp.cms.domain.TbClub;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClubRepository extends JpaRepository<TbClub, String> {
    Optional<TbClub> findBySlug(String clubSlug);
}
