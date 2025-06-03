package com.handongapp.cms.repository;

import com.handongapp.cms.domain.TbProgramProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProgramProgressRepository extends JpaRepository<TbProgramProgress, String> {
    /**
     * 사용자, 프로그램, 노드그룹에 해당하는 진행 상태 조회
     * 
     * @param userId 사용자 ID
     * @param programId 프로그램 ID
     * @param nodeGroupId 노드그룹 ID
     * @param deleted 삭제 여부
     * @return 프로그램 진행 상태
     */
    Optional<TbProgramProgress> findByUserIdAndProgramIdAndNodeGroupIdAndDeleted(
        String userId, String programId, String nodeGroupId, String deleted);
        
    /**
     * 특정 코스가 어떤 프로그램에 속해있는지 확인하는 쿼리
     * 
     * @param courseId 코스 ID
     * @param userId 사용자 ID
     * @param deleted 삭제 여부
     * @return 프로그램 ID와 해당 프로그램이 유효한지 여부
     */
    @Query(value = 
        "SELECT p.id AS programId FROM tb_program p " +
        "JOIN tb_program_participant pp ON p.id = pp.program_id AND pp.deleted = 'N' " +
        "JOIN tb_program_course pc ON p.id = pc.program_id AND pc.deleted = 'N' " +
        "WHERE pc.course_id = :courseId " +
        "AND pp.user_id = :userId " +
        "AND p.deleted = :deleted " +
        "AND p.start_date <= NOW() " +
        "AND p.end_date >= NOW() " +
        "LIMIT 1", nativeQuery = true)
    Optional<String> findValidProgramIdByCourseIdAndUserId(
        @Param("courseId") String courseId, 
        @Param("userId") String userId, 
        @Param("deleted") String deleted);
}
