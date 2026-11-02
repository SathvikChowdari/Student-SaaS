package com.schoolms.backend.controller;

import com.schoolms.backend.entity.Teacher;
import com.schoolms.backend.service.TeacherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/api/teachers")
public class TeacherController {

    @Autowired
    private TeacherService teacherService;

    // ✅ List all teachers
    @GetMapping
    public ResponseEntity<List<Teacher>> getAllTeachers() {
        return ResponseEntity.ok(teacherService.findAllTeachers());
    }

    // ✅ Create a new teacher profile
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/create")
    public ResponseEntity<?> createTeacher(@RequestBody Map<String, Object> data) {
        try {
            Long userId = Long.valueOf(data.get("userId").toString());
            String employeeCode = (String) data.get("employeeCode");
            String specialization = (String) data.get("subjectSpecialization");
            LocalDate doj = LocalDate.parse((String) data.get("dateOfJoining"));

            if (teacherService.existsByEmployeeCode(employeeCode)) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Employee Code already exists");
            }

            Teacher teacher = teacherService.createTeacher(userId, employeeCode, specialization, doj);
            return ResponseEntity.ok(Map.of(
                    "message", "Teacher profile created successfully",
                    "teacherId", teacher.getId()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // ✅ Update teacher profile
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<?> updateTeacher(@PathVariable Long id, @RequestBody Map<String, String> data) {
        String specialization = data.get("subjectSpecialization");
        LocalDate doj = data.containsKey("dateOfJoining") ? LocalDate.parse(data.get("dateOfJoining")) : null;

        Teacher updated = teacherService.updateTeacher(id, specialization, doj);
        if (updated == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Teacher not found");
        }
        return ResponseEntity.ok(Map.of("message", "Teacher updated successfully"));
    }

    // ✅ Delete teacher profile
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTeacher(@PathVariable Long id) {
        boolean deleted = teacherService.deleteTeacher(id);
        if (!deleted) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Teacher not found");
        }
        return ResponseEntity.ok(Map.of("message", "Teacher deleted successfully"));
    }
}