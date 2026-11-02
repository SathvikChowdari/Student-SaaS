package com.schoolms.backend.service;

import com.schoolms.backend.entity.AcademicYear;
import com.schoolms.backend.repository.AcademicYearRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class AcademicYearService {

    @Autowired
    private AcademicYearRepository repository;

    public List<AcademicYear> findAll() {
        return repository.findAll();
    }

    public AcademicYear createYear(AcademicYear academicYear) {
        if (repository.existsByName(academicYear.getName())) {
            throw new RuntimeException("Academic year name already exists");
        }
        // If this is the first year being created, make it active
        if (repository.count() == 0) {
            academicYear.setActive(true);
        }
        return repository.save(academicYear);
    }

    @Transactional
    public void activateYear(Long id) {
        // Deactivate all years first
        repository.findAll().forEach(year -> {
            year.setActive(false);
            repository.save(year);
        });

        // Activate the chosen one
        AcademicYear year = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Year not found"));
        year.setActive(true);
        repository.save(year);
    }

    public void deleteYear(Long id) {
        AcademicYear year = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Year not found"));
        if (year.isActive()) {
            throw new RuntimeException("Cannot delete the active academic year");
        }
        repository.deleteById(id);
    }
}