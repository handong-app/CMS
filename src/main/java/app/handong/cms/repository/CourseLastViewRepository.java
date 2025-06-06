package app.handong.cms.repository;

import app.handong.cms.domain.TbCourseLastView;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CourseLastViewRepository extends JpaRepository<TbCourseLastView, String> {
    /**
     * 사용자와 코스에 해당하는 마지막 조회 정보 찾기
     * 
     * @param userId 사용자 ID
     * @param courseId 코스 ID
     * @param deleted 삭제 여부
     * @return 마지막 조회 정보
     */
    Optional<TbCourseLastView> findByUserIdAndCourseIdAndDeleted(String userId, String courseId, String deleted);
}
