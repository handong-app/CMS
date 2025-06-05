package com.handongapp.cms.repository;

import com.handongapp.cms.domain.TbProgram;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TbProgramRepository extends JpaRepository<TbProgram, String> {
    // programSlug는 unique하지 않을 수 있으므로 clubId와 함께 조회
    Optional<TbProgram> findByClubIdAndSlugAndDeleted(String clubId, String slug, String deleted);

    boolean existsByClubIdAndSlugAndDeleted(String clubId, String slug, String deleted);
}
