package com.schoolms.backend.service;

import com.schoolms.backend.entity.Teacher;
import com.schoolms.backend.entity.User;
import com.schoolms.backend.repository.TeacherRepository;
import com.schoolms.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class TeacherService {

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private UserRepository userRepository;

    // Create Teacher (linked to a User ID)
    public Teacher createTeacher(Long userId, String employeeCode, String specialization, LocalDate doj) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        Teacher teacher = new Teacher();
        teacher.setUser(user);
        teacher.setEmployeeCode(employeeCode);
        teacher.setSubjectSpecialization(specialization);
        teacher.setDateOfJoining(doj);
        
        return teacherRepository.save(teacher);
    }

    public List<Teacher> findAllTeachers() {
        return teacherRepository.findAll();
    }

    public Teacher findById(Long id) {
        return teacherRepository.findById(id).orElse(null);
    }

    public boolean existsByEmployeeCode(String code) {
        return teacherRepository.existsByEmployeeCode(code);
    }

    public Teacher updateTeacher(Long id, String specialization, LocalDate doj) {
        Optional<Teacher> teacherOpt = teacherRepository.findById(id);
        if (teacherOpt.isPresent()) {
            Teacher teacher = teacherOpt.get();
            if (specialization != null) teacher.setSubjectSpecialization(specialization);
            if (doj != null) teacher.setDateOfJoining(doj);
            return teacherRepository.save(teacher);
        }
        return null;
    }

    public boolean deleteTeacher(Long id) {
        if (teacherRepository.existsById(id)) {
            teacherRepository.deleteById(id);
            return true;
        }
        return false;
    }
}