package com.handongapp.cms.repository;

import com.handongapp.cms.domain.TbProgramCourse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TbProgramCourseRepository extends JpaRepository<TbProgramCourse, String> {
    boolean existsByProgramIdAndCourseIdAndDeleted(String programId, String courseId, String deleted);
    List<TbProgramCourse> findByProgramIdAndDeleted(String programId, String deleted);
    Optional<TbProgramCourse> findByProgramIdAndCourseIdAndDeleted(String programId, String courseId, String deleted);
}
