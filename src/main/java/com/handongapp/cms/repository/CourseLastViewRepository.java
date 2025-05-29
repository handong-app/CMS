package com.handongapp.cms.repository;

import com.handongapp.cms.domain.TbCourseLastView;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseLastViewRepository extends JpaRepository<TbCourseLastView, String> {
}
