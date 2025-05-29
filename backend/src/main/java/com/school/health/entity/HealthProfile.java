package com.school.health.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "HealthProfile")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class HealthProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long profileId;

    @OneToOne
    @JoinColumn(name = "student_id", referencedColumnName = "studentId")
    private Students student;

    private String allergies;
    private String chronicDiseases;
    private String treatmentHistory;
    private String eyeSight;
    private String hearing;
    private String bloodType;
    private double weight;
    private double height;
    private String notes;

    private LocalDateTime updatedAt;
}

