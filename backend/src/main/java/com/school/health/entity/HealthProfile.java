package com.school.health.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.time.LocalDateTime;

import jakarta.validation.constraints.*;
import lombok.Data;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;

@Entity
@Table(name = "HealthProfile")
@Data
public class HealthProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ProfileId")
    private Integer profileId;

    @OneToOne
    @JoinColumn(name = "StudentId", referencedColumnName = "StudentId")
    private Student student;

    @ManyToOne
    @JoinColumn(name = "UpdatedBy", referencedColumnName = "UserId")
    private User updatedBy;

    @Column(name = "Allergies", length = 255,columnDefinition = "NVARCHAR(255)")
    private String allergies;

    @Column(name = "ChronicDiseases", length = 255,columnDefinition = "NVARCHAR(255)")
    private String chronicDiseases;

    @Column(name = "TreatmentHistory", length = 255,columnDefinition = "NVARCHAR(255)")
    private String treatmentHistory;

    @Column(name = "Eyesight", length = 255, columnDefinition = "NVARCHAR(255)")
    private String eyesight;

    @Column(name = "Hearing", length = 50,columnDefinition = "NVARCHAR(255)")
    private String hearing;

    @Pattern(regexp = "^(A|B|AB|O)[+-]?$", message = "Nhóm máu không hợp lệ")
    @Column(name = "BloodType", length = 10)
    private String bloodType;

    @DecimalMin(value = "0.1", message = "Cân nặng phải lớn hơn 0")
    @DecimalMax(value = "999.99", message = "Cân nặng không hợp lệ")
    @Column(name = "Weight", precision = 5, scale = 2)
    private BigDecimal weight;

    @Column(name = "Height", precision = 5, scale = 2)
    private BigDecimal height;

    @Column(name = "Notes", length = 255,columnDefinition = "NVARCHAR(255)")
    private String notes;

    @Column(name = "UpdatedAt")
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}