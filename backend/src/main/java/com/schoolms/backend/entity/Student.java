package com.schoolms.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "students")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String rollNo;
    private LocalDate dateOfBirth;
    private String address;
    private String guardianName;
    private String contactNo;
    private LocalDate admissionDate;

    @ManyToOne
    @JoinColumn(name = "class_id")
    private ClassEntity classEntity;

    @OneToMany(mappedBy = "student")
    private List<Marks> marks;

    @OneToMany(mappedBy = "student")
    private List<Attendance> attendanceRecords;

    // @OneToMany(mappedBy = "student")
    // private List<Fee> fees;
}
