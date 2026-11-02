package com.schoolms.backend.service;

import com.schoolms.backend.entity.Student;
import com.schoolms.backend.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    // Create Student
    public Student createStudent(Student student) {
        if (studentRepository.existsByRollNo(student.getRollNo())) {
            throw new RuntimeException("Roll Number already exists: " + student.getRollNo());
        }
        return studentRepository.save(student);
    }

    public List<Student> findAllStudents() {
        return studentRepository.findAll();
    }

    public Optional<Student> findById(Long id) {
        return studentRepository.findById(id);
    }

    public Student updateStudent(Long id, Student studentDetails) {
        return studentRepository.findById(id).map(student -> {
            student.setName(studentDetails.getName());
            student.setRollNo(studentDetails.getRollNo());
            student.setDateOfBirth(studentDetails.getDateOfBirth());
            student.setAddress(studentDetails.getAddress());
            student.setGuardianName(studentDetails.getGuardianName());
            student.setContactNo(studentDetails.getContactNo());
            student.setAdmissionDate(studentDetails.getAdmissionDate());
            // Update classEntity if needed
            if(studentDetails.getClassEntity() != null) {
                student.setClassEntity(studentDetails.getClassEntity());
            }
            return studentRepository.save(student);
        }).orElseThrow(() -> new RuntimeException("Student not found with id: " + id));
    }

    public boolean deleteStudent(Long id) {
        if (studentRepository.existsById(id)) {
            studentRepository.deleteById(id);
            return true;
        }
        return false;
    }
}