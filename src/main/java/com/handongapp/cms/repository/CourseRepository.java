package com.handongapp.cms.repository;

import com.handongapp.cms.domain.TbCourse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<TbCourse, String> {
    Optional<TbCourse> findBySlugAndDeleted(String slug, String deleted);
    Optional<TbCourse> findByClubIdAndSlugAndDeleted(String clubId, String slug, String deleted);
}
