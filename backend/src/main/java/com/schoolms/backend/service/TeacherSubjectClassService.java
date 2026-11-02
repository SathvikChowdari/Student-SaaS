package com.schoolms.backend.service;

import com.schoolms.backend.entity.*;
import com.schoolms.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TeacherSubjectClassService {

    @Autowired private TeacherSubjectClassRepository repository;
    @Autowired private TeacherRepository teacherRepo;
    @Autowired private SubjectRepository subjectRepo;
    @Autowired private ClassEntityRepository classRepo;
    @Autowired private AcademicYearRepository yearRepo;

    public List<TeacherSubjectClass> getAllAssignments() {
        return repository.findAll();
    }

    public TeacherSubjectClass assignTeacher(Long teacherId, Long subjectId, Long classId, Long academicId) {
        // 1. Validate existence
        Teacher teacher = teacherRepo.findById(teacherId)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));
        Subject subject = subjectRepo.findById(subjectId)
                .orElseThrow(() -> new RuntimeException("Subject not found"));
        ClassEntity classEntity = classRepo.findById(classId)
                .orElseThrow(() -> new RuntimeException("Class not found"));
        AcademicYear year = yearRepo.findById(academicId)
                .orElseThrow(() -> new RuntimeException("Academic Year not found"));

        // 2. Check for duplicates
        if (repository.existsByTeacherIdAndSubjectIdAndClassEntityIdAndAcademicYearId(
                teacherId, subjectId, classId, academicId)) {
            throw new RuntimeException("This assignment already exists!");
        }

        // 3. Create and Save
        TeacherSubjectClass assignment = new TeacherSubjectClass();
        assignment.setTeacher(teacher);
        assignment.setSubject(subject);
        assignment.setClassEntity(classEntity);
        assignment.setAcademicYear(year);

        return repository.save(assignment);
    }

    public void deleteAssignment(Long id) {
        repository.deleteById(id);
    }
}