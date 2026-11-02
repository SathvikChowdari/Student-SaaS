package com.schoolms.backend.repository;

import com.schoolms.backend.entity.ClassEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClassEntityRepository extends JpaRepository<ClassEntity, Long> {
    // Find class by standard and section (e.g., 10th Grade, Section B)
    Optional<ClassEntity> findByStandardAndSection(String standard, String section);
    
    boolean existsByStandardAndSection(String standard, String section);
}