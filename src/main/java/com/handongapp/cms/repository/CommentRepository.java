package com.handongapp.cms.repository;

import com.handongapp.cms.domain.TbComment;
import com.handongapp.cms.dto.v1.CommentDto;
import com.handongapp.cms.dto.v1.CommentResponseDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.repository.query.Param;

@Repository
public interface CommentRepository extends JpaRepository<TbComment, String> {

    List<TbComment> findByTargetIdAndDeleted(String targetId, String deleted);
    Optional<TbComment> findByUserIdAndTargetIdAndDeleted(String userId, String targetId, String deleted);
    Optional<TbComment> findByIdAndDeleted(String id, String deleted);

    @Query("SELECT new com.handongapp.cms.dto.v1.CommentResponseDto(" +
           "c.id, c.targetId, c.userId, u.name, c.categoryId, c.content, c.createdAt, c.updatedAt) " +
           "FROM TbComment c " +
           "LEFT JOIN com.handongapp.cms.domain.TbUser u ON c.userId = u.id " +
           "WHERE ((:targetIds) IS NULL OR c.targetId IN (:targetIds)) " +
           "AND (:userId IS NULL OR c.userId = :userId) " +
           "AND c.deleted = :deletedStatus " +
           "ORDER BY c.createdAt DESC")
    List<CommentResponseDto> findCommentsByCriteria(
            @Param("targetIds") List<String> targetIds,
            @Param("userId") String userId,
            @Param("deletedStatus") String deletedStatus
    );
}
