package app.handong.cms.repository;

import app.handong.cms.domain.TbSection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface SectionRepository extends JpaRepository<TbSection, String> {
    Optional<TbSection> findByIdAndDeleted(String id, String deleted);
    List<TbSection> findByCourseIdAndDeletedOrderByOrderAsc(String courseId, String deleted);

    @Query("SELECT s FROM TbSection s WHERE s.courseId = :courseId AND s.deleted = 'N' AND s.order > :currentOrder ORDER BY s.order ASC LIMIT 1")
    Optional<TbSection> findNextInCourse(@Param("courseId") String courseId, @Param("currentOrder") int currentOrder);
}
