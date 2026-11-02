package com.schoolms.backend.service;

import com.schoolms.backend.entity.ClassEntity;
import com.schoolms.backend.entity.Teacher;
import com.schoolms.backend.repository.ClassEntityRepository;
import com.schoolms.backend.repository.TeacherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClassEntityService {

    @Autowired
    private ClassEntityRepository classRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    // Create a new Class
    public ClassEntity createClass(String standard, String section, Long classTeacherId) {
        ClassEntity classEntity = new ClassEntity();
        classEntity.setStandard(standard);
        classEntity.setSection(section);

        if (classTeacherId != null) {
            Teacher teacher = teacherRepository.findById(classTeacherId)
                    .orElseThrow(() -> new RuntimeException("Teacher not found"));
            classEntity.setClassTeacher(teacher);
        }

        return classRepository.save(classEntity);
    }

    public List<ClassEntity> findAllClasses() {
        return classRepository.findAll();
    }

    public boolean existsByStandardAndSection(String standard, String section) {
        return classRepository.existsByStandardAndSection(standard, section);
    }

    public ClassEntity updateClass(Long id, String standard, String section, Long teacherId) {
        Optional<ClassEntity> classOpt = classRepository.findById(id);
        if (classOpt.isPresent()) {
            ClassEntity classEntity = classOpt.get();
            if (standard != null) classEntity.setStandard(standard);
            if (section != null) classEntity.setSection(section);
            
            if (teacherId != null) {
                Teacher teacher = teacherRepository.findById(teacherId).orElse(null);
                classEntity.setClassTeacher(teacher);
            }
            return classRepository.save(classEntity);
        }
        return null;
    }

    public boolean deleteClass(Long id) {
        if (classRepository.existsById(id)) {
            classRepository.deleteById(id);
            return true;
        }
        return false;
    }
}