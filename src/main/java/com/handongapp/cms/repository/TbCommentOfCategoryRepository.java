package com.handongapp.cms.repository;

import com.handongapp.cms.domain.TbCommentOfCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TbCommentOfCategoryRepository extends JpaRepository<TbCommentOfCategory, String> {
}
