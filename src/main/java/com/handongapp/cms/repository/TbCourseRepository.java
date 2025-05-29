package com.handongapp.cms.repository;

import com.handongapp.cms.domain.TbCourse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface TbCourseRepository extends JpaRepository<TbCourse, String> {
    Optional<TbCourse> findByIdAndDeleted(String id, String deleted);
    Optional<TbCourse> findBySlugAndDeleted(String slug, String deleted);
    List<TbCourse> findByClubIdAndDeleted(String clubId, String deleted);
    Optional<TbCourse> findByClubIdAndSlugAndDeleted(String clubId, String slug, String deleted);
}
