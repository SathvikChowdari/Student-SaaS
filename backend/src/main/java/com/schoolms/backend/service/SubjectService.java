package com.schoolms.backend.service;

import com.schoolms.backend.entity.Subject;
import com.schoolms.backend.entity.ClassEntity;
import com.schoolms.backend.entity.AcademicYear;
import com.schoolms.backend.repository.SubjectRepository;
import com.schoolms.backend.repository.ClassEntityRepository;
import com.schoolms.backend.repository.TeacherSubjectClassRepository;
import com.schoolms.backend.repository.AcademicYearRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SubjectService {

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private ClassEntityRepository classRepository;

    @Autowired
    private TeacherSubjectClassRepository assignmentRepository;

    @Autowired
    private AcademicYearRepository yearRepository;

    public Subject createSubject(String name, Long classId) {
        ClassEntity classEntity = classRepository.findById(classId)
                .orElseThrow(() -> new RuntimeException("Class not found"));
        Subject subject = new Subject();
        subject.setName(name);
        subject.setClassEntity(classEntity);
        return subjectRepository.save(subject);
    }

    public List<Subject> findAllSubjects() {
        return subjectRepository.findAll();
    }

    public boolean existsByNameInClass(String name, Long classId) {
        return subjectRepository.existsByNameAndClassEntityId(name, classId);
    }

    @Transactional
    public Subject updateSubjectAndTeacher(Long id, String name, Long teacherId) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subject not found"));
        
        // 1. Update Name
        if (name != null && !name.trim().isEmpty()) {
            subject.setName(name);
        }

        // 2. Reassign Teacher for the ACTIVE academic year
        if (teacherId != null) {
            AcademicYear activeYear = yearRepository.findAll().stream()
                    .filter(year -> year.isActive())
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("No active academic year found"));

            assignmentRepository.updateTeacherForSubject(teacherId, id, activeYear.getId());
        }

        return subjectRepository.save(subject);
    }

    @Transactional
    public boolean deleteSubject(Long id) {
        if (subjectRepository.existsById(id)) {
            assignmentRepository.deleteBySubjectId(id);
            subjectRepository.deleteById(id);
            return true;
        }
        return false;
    }
}