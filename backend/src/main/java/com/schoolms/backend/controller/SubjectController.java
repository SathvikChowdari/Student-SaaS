package com.schoolms.backend.controller;

import com.schoolms.backend.entity.Subject;
import com.schoolms.backend.service.SubjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/api/subjects")
public class SubjectController {

    @Autowired
    private SubjectService subjectService;

    @GetMapping
    public ResponseEntity<List<Subject>> getAllSubjects() {
        return ResponseEntity.ok(subjectService.findAllSubjects());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/create")
    public ResponseEntity<?> createSubject(@RequestBody Map<String, Object> data) {
        String name = (String) data.get("name");
        Long classId = Long.valueOf(data.get("classId").toString());
        if (subjectService.existsByNameInClass(name, classId)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Subject exists in this class");
        }
        Subject subject = subjectService.createSubject(name, classId);
        return ResponseEntity.ok(Map.of("subjectId", subject.getId()));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<?> updateSubject(@PathVariable Long id, @RequestBody Map<String, Object> data) {
        String name = (String) data.get("name");
        Long teacherId = data.get("teacherId") != null ? Long.valueOf(data.get("teacherId").toString()) : null;

        Subject updated = subjectService.updateSubjectAndTeacher(id, name, teacherId);
        if (updated == null) return ResponseEntity.notFound().build();
        
        return ResponseEntity.ok(Map.of("message", "Subject name and Teacher updated successfully"));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSubject(@PathVariable Long id) {
        boolean deleted = subjectService.deleteSubject(id);
        if (!deleted) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(Map.of("message", "Deleted"));
    }
}