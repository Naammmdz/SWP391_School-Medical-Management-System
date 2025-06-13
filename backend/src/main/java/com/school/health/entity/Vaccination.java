package com.school.health.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Vaccination {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "VaccinationId")
    private int vaccinationId;
    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    @JoinColumn(name = "StudentId")
    private Student student;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CampaignId")
    private VaccinationCampaign campaign;
    @Column(name = "VaccineName")
    private String vaccineName;
    @Column(name = "Date")
    private LocalDate date;
    @Column(name = "Result")
    private String result;
    @Column(name = "ParentConfirmation")
    private boolean parentConfirmation;
    @Column(name = "Notes")
    private String notes;
    @Column(name = "CreatedAt")
    @CreationTimestamp
    private LocalDateTime createdAt;
}
