package com.school.health.entity;



import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "MedicalEvent")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MedicalEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "EventId", nullable = false)
    private int id;

    @OneToOne
    @JoinColumn(name = "StudentId", nullable = false)
    private Student student;

    @Column(name = "EventType", columnDefinition = "NVARCHAR(50)")
    private String eventType;

    @Column(name = "Description", columnDefinition = "NVARCHAR(255)")
    private String description;
    @CreationTimestamp
    @Column(name = "CreatedAt")
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "CreatedBy", nullable = false)
    private User createdBy;

    @Column(name = "RelatedMedicinesUsed", columnDefinition = "NVARCHAR(255)")
    private String relatedMedicinesUsed;

    @Column(name = "Notes", columnDefinition = "NVARCHAR(255)")
    private String notes;
}
