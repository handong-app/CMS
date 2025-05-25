package com.handongapp.cms.repository;

import com.handongapp.cms.domain.TbClub;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TbClubRepository extends JpaRepository<TbClub, String> {
}
