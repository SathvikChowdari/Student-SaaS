package com.schoolms.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "students")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    
    @Column(unique = true, nullable = false)
    private String rollNo;
    
    private LocalDate dateOfBirth;
    private String address;
    private String guardianName;
    private String contactNo;
    private LocalDate admissionDate;

    @ManyToOne
    @JoinColumn(name = "class_id")
    private ClassEntity classEntity;
    
    // Transient field to handle classId from JSON
    @Transient
    @JsonProperty("classId")
    private Long classId;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Marks> marks;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Attendance> attendanceRecords;
    
    // Custom setter to handle classId from JSON
    public void setClassId(Long classId) {
        this.classId = classId;
        if (classId != null) {
            // Create a ClassEntity with just the ID for the foreign key relationship
            this.classEntity = new ClassEntity();
            this.classEntity.setId(classId);
        } else {
            this.classEntity = null;
        }
    }
    
    // Custom getter to return classId
    public Long getClassId() {
        return this.classEntity != null ? this.classEntity.getId() : null;
    }
}