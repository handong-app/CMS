package com.handongapp.cms.repository;

import com.handongapp.cms.domain.TbComment;
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

    @Query("SELECT c FROM TbComment c WHERE " +
           "((:targetIds) IS NULL OR c.targetId IN (:targetIds)) AND " +
           "(:userId IS NULL OR c.userId = :userId) AND " +
           "c.deleted = :deletedStatus " +
           "ORDER BY c.createdAt DESC")
    List<TbComment> findCommentsByCriteria(
            @Param("targetIds") List<String> targetIds,
            @Param("userId") String userId,
            @Param("deletedStatus") String deletedStatus
    );
    
    /**
     * 코멘트를 조회하면서 코멘트 카테고리 정보를 LEFT JOIN하여 함께 가져오는 쿼리
     * 카테고리가 없는 경우에도 코멘트는 조회되어야 하기 때문에 LEFT JOIN 사용
     */
    @Query("SELECT c, cat FROM TbComment c " +
           "LEFT JOIN TbCommentOfCategory cat ON c.categoryId = cat.id " +
           "WHERE ((:targetIds) IS NULL OR c.targetId IN (:targetIds)) AND " +
           "(:userId IS NULL OR c.userId = :userId) AND " +
           "c.deleted = :deletedStatus " +
           "ORDER BY c.createdAt DESC")
    List<Object[]> findCommentsWithCategoriesByCriteria(
            @Param("targetIds") List<String> targetIds,
            @Param("userId") String userId,
            @Param("deletedStatus") String deletedStatus
    );
}
