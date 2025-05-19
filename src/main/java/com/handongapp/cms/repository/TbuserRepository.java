package com.handongapp.cms.repository;

import com.handongapp.cms.domain.Tbuser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TbuserRepository extends JpaRepository<Tbuser, Long> {
    Optional<Tbuser> findByEmail(String email);

    Optional<Tbuser> findByUserId(String userId);
}