package com.schoolms.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "teacher_subject_class")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TeacherSubjectClass {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "teacher_id")
    @JsonIgnore
    private Teacher teacher;

    @ManyToOne
    @JoinColumn(name = "subject_id")
    @JsonIgnore
    private Subject subject;

    @ManyToOne
    @JoinColumn(name = "class_id")
    @JsonIgnore
    private ClassEntity classEntity;

    @ManyToOne
    @JoinColumn(name = "academic_year_id")
    @JsonIgnore
    private AcademicYear academicYear;
}
