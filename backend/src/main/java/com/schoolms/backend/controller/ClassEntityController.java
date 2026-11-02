package com.schoolms.backend.controller;

import com.schoolms.backend.entity.ClassEntity;
import com.schoolms.backend.service.ClassEntityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/api/classes")
public class ClassEntityController {

    @Autowired
    private ClassEntityService classService;

    // ✅ List all classes
    @GetMapping
    public ResponseEntity<List<ClassEntity>> getAllClasses() {
        return ResponseEntity.ok(classService.findAllClasses());
    }

    // ✅ Create a new class
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/create")
    public ResponseEntity<?> createClass(@RequestBody Map<String, Object> data) {
        String standard = (String) data.get("standard");
        String section = (String) data.get("section");
        
        // teacherId is optional during class creation
        Long teacherId = data.get("teacherId") != null ? Long.valueOf(data.get("teacherId").toString()) : null;

        if (standard == null || section == null) {
            return ResponseEntity.badRequest().body("Standard and Section are required");
        }

        if (classService.existsByStandardAndSection(standard, section)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Class already exists");
        }

        ClassEntity newClass = classService.createClass(standard, section, teacherId);
        return ResponseEntity.ok(Map.of(
                "message", "Class created successfully",
                "classId", newClass.getId()));
    }

    // ✅ Update class details or change Class Teacher
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<?> updateClass(@PathVariable Long id, @RequestBody Map<String, Object> data) {
        String standard = (String) data.get("standard");
        String section = (String) data.get("section");
        Long teacherId = data.get("teacherId") != null ? Long.valueOf(data.get("teacherId").toString()) : null;

        ClassEntity updated = classService.updateClass(id, standard, section, teacherId);
        if (updated == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Class not found");
        }
        return ResponseEntity.ok(Map.of("message", "Class updated successfully"));
    }

    // ✅ Delete a class
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteClass(@PathVariable Long id) {
        boolean deleted = classService.deleteClass(id);
        if (!deleted) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Class not found");
        }
        return ResponseEntity.ok(Map.of("message", "Class deleted successfully"));
    }
}