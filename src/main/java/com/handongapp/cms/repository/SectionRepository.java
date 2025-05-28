package com.handongapp.cms.repository;

import com.handongapp.cms.domain.TbSection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SectionRepository extends JpaRepository<TbSection, String> {
}
