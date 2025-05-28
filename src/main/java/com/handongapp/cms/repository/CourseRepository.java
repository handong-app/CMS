package com.handongapp.cms.repository;

import com.handongapp.cms.domain.TbCourse;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseRepository extends JpaRepository<TbCourse, String>, CourseRepositoryCustom {
}
