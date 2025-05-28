package com.handongapp.cms.repository;

import com.handongapp.cms.domain.TbCourse;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TbCourseRepository extends JpaRepository<TbCourse, String>, TbCourseRepositoryCustom {
}
