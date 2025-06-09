package com.school.health.entity;

import jakarta.persistence.*;
import lombok.*;
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
    @JoinColumn(name = "StudentId")
    private Student student;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CampaignId")
    private VaccinationCampaign campaign;
    private String vaccineName;
    private LocalDate date;
    private String result;
    private boolean parentConfirmation;
    private String notes;
    private LocalDateTime createdAt;
}
