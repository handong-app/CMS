package com.handongapp.cms.repository;

import com.handongapp.cms.domain.TbClubRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TbClubRoleRepository extends JpaRepository<TbClubRole, Long> {
}
