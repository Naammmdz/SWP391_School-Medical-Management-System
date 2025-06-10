package com.school.health.entity;

import com.school.health.enums.Status;
import jakarta.persistence.Entity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "VaccinationCampaign")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class VaccinationCampaign {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CampaignId")
    private int campaignId;
    @Column(name = "CampaignName")
    private String campaignName;
    @Column(name = "Description")
    private String description;
    @Column(name = "ScheduledDate")
    private LocalDate scheduledDate;
    @Column(name = "CreatedBy")
    private int createdBy;
    @Column(name = "ApprovedBy")
    private int ApprovedBy;
    @Column(name = "ApprovedAt")
    @CreationTimestamp
    private LocalDateTime approvedAt;
    @Enumerated(EnumType.STRING)
    @Column(name = "Status")
    private Status status;
    @Column(name = "CreatedAt")
    @CreationTimestamp
    private LocalDateTime createdAt;
}
