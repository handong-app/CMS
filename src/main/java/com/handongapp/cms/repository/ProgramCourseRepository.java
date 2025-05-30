package com.handongapp.cms.repository;

import com.handongapp.cms.domain.TbProgramCourse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProgramCourseRepository extends JpaRepository<TbProgramCourse, String> {
}
