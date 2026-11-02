package com.schoolms.backend.controller;

import com.schoolms.backend.entity.TeacherSubjectClass;
import com.schoolms.backend.service.TeacherSubjectClassService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/assignments")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class TeacherSubjectClassController {

    @Autowired
    private TeacherSubjectClassService service;

    @GetMapping
    public List<TeacherSubjectClass> getAll() {
        return service.getAllAssignments();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/assign")
    public ResponseEntity<?> createAssignment(@RequestBody Map<String, Long> ids) {
        try {
            TeacherSubjectClass result = service.assignTeacher(
                ids.get("teacherId"),
                ids.get("subjectId"),
                ids.get("classId"),
                ids.get("academicYearId")
            );
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        service.deleteAssignment(id);
        return ResponseEntity.ok("Assignment removed");
    }
}