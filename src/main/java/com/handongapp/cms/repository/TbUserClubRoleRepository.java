package com.handongapp.cms.repository;

import com.handongapp.cms.domain.TbUserClubRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TbUserClubRoleRepository extends JpaRepository<TbUserClubRole, String> {
    /**
     * 특정 사용자가 특정 동아리에 대해 지정된 역할 중 하나를 가지고 있는지 확인합니다 (삭제되지 않은 항목 대상).
     *
     * @param userId 사용자의 ID
     * @param clubId 동아리의 ID (TbClub의 ID)
     * @param deleted 삭제 플래그 ("N" for not deleted)
     * @return 역할 존재 여부
     */
    boolean existsByUserIdAndClubIdAndDeleted(String userId, String clubId, String deleted);

    // 필요에 따라 추가 메서드 정의 가능
    // 예: 특정 사용자가 속한 모든 동아리-역할 정보 조회 (삭제되지 않은 항목 대상)
    // List<TbUserClubRole> findAllByUserIdAndDeleted(String userId, String deleted);
}
