package com.handongapp.cms.repository;

import com.handongapp.cms.domain.TbComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TbCommentRepository extends JpaRepository<TbComment, String> {
    
    List<TbComment> findByTargetIdAndDeleted(String targetId, String deleted);
    Optional<TbComment> findByUserIdAndTargetIdAndDeleted(String userId, String targetId, String deleted);
    Optional<TbComment> findByIdAndDeleted(String id, String deleted);
}
