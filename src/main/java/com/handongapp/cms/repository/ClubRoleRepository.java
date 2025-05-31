package com.handongapp.cms.repository;

import com.handongapp.cms.domain.TbClubRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClubRoleRepository extends JpaRepository<TbClubRole, String> {
}
