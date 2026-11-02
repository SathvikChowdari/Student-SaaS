package com.schoolms.backend.repository;

import com.schoolms.backend.entity.TeacherSubjectClass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface TeacherSubjectClassRepository extends JpaRepository<TeacherSubjectClass, Long> {

    // Standard Query Method (Spring handles this automatically)
    boolean existsByTeacherIdAndSubjectIdAndClassEntityIdAndAcademicYearId(
        Long teacherId, Long subjectId, Long classEntityId, Long academicYearId
    );

    @Modifying
    @Transactional
    @Query("UPDATE TeacherSubjectClass tsc SET tsc.teacher.id = :teacherId " +
           "WHERE tsc.subject.id = :subjectId AND tsc.academicYear.id = :yearId")
    void updateTeacherForSubject(@Param("teacherId") Long teacherId, 
                                 @Param("subjectId") Long subjectId, 
                                 @Param("yearId") Long yearId);

    @Transactional
    void deleteBySubjectId(Long subjectId);
}