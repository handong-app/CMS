package app.handong.cms.repository;

import app.handong.cms.domain.TbCommentOfCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentOfCategoryRepository extends JpaRepository<TbCommentOfCategory, String> {
    List<TbCommentOfCategory> findByCourseIdAndDeletedOrderByCreatedAtAsc(String courseId, String deleted);
}
