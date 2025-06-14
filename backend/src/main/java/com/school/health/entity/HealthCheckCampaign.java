package com.school.health.entity;

import com.school.health.enums.Status;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HealthCheckCampaign {
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
    private int approvedBy;
    @CreationTimestamp
    @Column(name = "ApprovedAt")
    private LocalDateTime approvedAt;
    @Enumerated(EnumType.STRING)
    @Column(name = "Status")
    private Status status;
    @CreationTimestamp
    @Column(name = "CreatedAt")
    private LocalDateTime createdAt;


}
