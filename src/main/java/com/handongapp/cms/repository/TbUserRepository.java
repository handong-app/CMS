package com.handongapp.cms.repository;

import com.handongapp.cms.domain.TbUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TbUserRepository extends JpaRepository<TbUser, Long> {
    Optional<TbUser> findByEmail(String email);

    Optional<TbUser> findByUserId(String userId);
}