package com.school.health.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.*;


@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HealthCheck {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CheckId")
    private int checkId;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "StudentId")
    private Student student;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CampaignId")
    private HealthCheckCampaign campaign;
    @Column(name = "Date")
    private LocalDate date;
    @Column(name = "Height")
    private double height;
    @Column(name = "Weight")
    private double weight;
    @Column(name = "Eyesight")
    private String eyesight;
    @Column(name = "Hearing")
    private String hearing;
    @Column(name = "ParentConfirmation")
    private boolean parentConfirmation;
    @Column(name = "Notes")
    private String notes;
    @CreationTimestamp
    @Column(name = "CreatedAt")
    private LocalDateTime createdAt;

}
