package com.handongapp.cms.repository;

import com.handongapp.cms.domain.TbComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TbCommentRepository extends JpaRepository<TbComment, String> {
}
