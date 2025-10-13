package com.schoolms.backend.entity;

import jakarta.persistence.*;
import lombok.*;

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
    private Teacher teacher;

    @ManyToOne
    @JoinColumn(name = "subject_id")
    private Subject subject;

    @ManyToOne
    @JoinColumn(name = "class_id")
    private ClassEntity classEntity;

    @ManyToOne
    @JoinColumn(name = "academic_year_id")
    private AcademicYear academicYear;
}
