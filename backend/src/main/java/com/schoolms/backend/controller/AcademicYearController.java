package com.schoolms.backend.controller;

import com.schoolms.backend.entity.AcademicYear;
import com.schoolms.backend.service.AcademicYearService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/academic-years")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AcademicYearController {

    @Autowired
    private AcademicYearService service;

    @GetMapping
    public List<AcademicYear> getAll() {
        return service.findAll();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody AcademicYear academicYear) {
        try {
            return ResponseEntity.ok(service.createYear(academicYear));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{id}/activate")
    public ResponseEntity<?> activate(@PathVariable Long id) {
        try {
            service.activateYear(id);
            return ResponseEntity.ok(Map.of("message", "Academic year activated successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            service.deleteYear(id);
            return ResponseEntity.ok(Map.of("message", "Year deleted"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}