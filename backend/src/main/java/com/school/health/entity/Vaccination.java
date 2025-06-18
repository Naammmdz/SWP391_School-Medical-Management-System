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
    @JsonIgnore // thêm đoạn code này để tránh vòng lặp vô hạn khi serialize bởi vì nó sẽ bị vòng lặp với Student
    @JoinColumn(name = "StudentId")
    private Student student;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CampaignId")
    private VaccinationCampaign campaign;
    @Column(name = "VaccineName")
    private String vaccineName;
    //
    @Column(name = "DoseNumber")
    private Integer doseNumber; // số mũi tiêm, ví dụ: 1, 2, 3
    @Column(name = "AdverseReaction", columnDefinition = "NVARCHAR(255)")
    private String adverseReaction; // phản ứng phụ nếu có
    // check xem đã tiêm đợt trước chưa
    @Column(name = "IsPreviousDose")
    private boolean isPreviousDose; // true nếu đã tiêm đợt trước, false nếu đây là mũi đầu tiên
    //
    @Column(name = "Date")
    private LocalDate date;
    @Column(name = "Result",columnDefinition = "NVARCHAR(255)")
    private String result;
    @Column(name = "ParentConfirmation")
    private boolean parentConfirmation;
    @Column(name = "Notes",columnDefinition = "NVARCHAR(255)")
    private String notes;
    @Column(name = "CreatedAt")
    @CreationTimestamp
    private LocalDateTime createdAt;
}
