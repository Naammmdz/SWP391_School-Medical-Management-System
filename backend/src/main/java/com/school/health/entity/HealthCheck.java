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
    @Column(name = "EyesightLeft")
    private String eyesightLeft;
    @Column(name = "EyesightRight")
    private String eyesightRight;
    @Column(name = "BloodPressure")
    private String bloodPressure; // huyết áp
    @Column(name = "HearingLeft",columnDefinition = "NVARCHAR(255)")
    private String hearingLeft;
    @Column(name = "HearingRight",columnDefinition = "NVARCHAR(255)")
    private String hearingRight;
    @Column(name = "Temperature", columnDefinition = "NVARCHAR(50)")
    private String temperature; // nhiệt độ
    @Column(name = "ConsultationAppointment")
    private boolean consultationAppointment; // true nếu muốn hẹn lịch khám để tư vấn, false nếu không muốn
    @Column(name = "ParentConfirmation")
    private boolean parentConfirmation;
    @Column(name = "Notes",columnDefinition = "NVARCHAR(255)")
    private String notes;
    // thêm có muốn hẹn lịch khám để tư vấn hay không

    @CreationTimestamp
    @Column(name = "CreatedAt")
    private LocalDateTime createdAt;

}
