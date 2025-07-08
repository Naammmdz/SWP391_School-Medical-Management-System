package com.school.health.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
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
    @Column(name = "CampaignName",columnDefinition = "NVARCHAR(255)")
    private String campaignName;
    @Column(name = "TargetGroup", columnDefinition = "NVARCHAR(255)")
    private String targetGroup;
    @Column(name = "Type", columnDefinition = "NVARCHAR(255)")
    private String type;
    @Column(name = "Address", columnDefinition = "NVARCHAR(255)")
    private String address; // địa điểm tổ chức khám
    @Column(name = "Organizer", columnDefinition = "NVARCHAR(255)")
    private String organizer; // người thực hiện chiến dịch
    @Column(name = "Description",columnDefinition = "NVARCHAR(255)")
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
//    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;
    @Column(name = "RejectionReason", columnDefinition = "NVARCHAR(255)")
    private String rejectionReason;


}
