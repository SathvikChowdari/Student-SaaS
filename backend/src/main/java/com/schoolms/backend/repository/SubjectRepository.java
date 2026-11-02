package com.schoolms.backend.repository;

import com.schoolms.backend.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Long> {
    List<Subject> findByClassEntityId(Long classId);
    boolean existsByNameAndClassEntityId(String name, Long classId);
}