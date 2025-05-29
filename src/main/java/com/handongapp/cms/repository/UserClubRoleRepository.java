package com.handongapp.cms.repository;

import com.handongapp.cms.domain.TbUserClubRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserClubRoleRepository extends JpaRepository<TbUserClubRole, String> {
}
