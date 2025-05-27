package com.handongapp.cms.repository;

import com.handongapp.cms.domain.TbCourse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TbCourseRepository extends JpaRepository<TbCourse, String> {
}
