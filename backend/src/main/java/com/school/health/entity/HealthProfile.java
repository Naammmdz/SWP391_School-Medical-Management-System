package com.school.health.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

import jakarta.validation.constraints.*;
import lombok.Data;
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

//    @ManyToOne
//    @JoinColumn(name = "UpdatedAt", referencedColumnName = "UserId")
//    private User user;

    @Column(name = "Allergies", length = 255)
    private String allergies;

    @Column(name = "ChronicDiseases", length = 255)
    private String chronicDiseases;

    @Column(name = "TreatmentHistory", length = 255)
    private String treatmentHistory;

    @Column(name = "Eyesight", length = 50)
    private String eyesight;

    @Column(name = "Hearing", length = 50)
    private String hearing;

    @Pattern(regexp = "^(A|B|AB|O)[+-]?$", message = "Nhóm máu không hợp lệ")
    @Column(name = "BloodType", length = 10)
    private String bloodType;

    @DecimalMin(value = "0.1", message = "Cân nặng phải lớn hơn 0")
    @DecimalMax(value = "999.99", message = "Cân nặng không hợp lệ")
    @Column(name = "Weight", precision = 5, scale = 2)
    private BigDecimal weight;

    @DecimalMin(value = "0.1", message = "Chiều cao phải lớn hơn 0")
    @DecimalMax(value = "999.99", message = "Chiều cao không hợp lệ")
    @Column(name = "Height", precision = 5, scale = 2)
    private BigDecimal height;

    @Column(name = "Notes", length = 255)
    private String notes;

    @Column(name = "UpdatedAt")
    private LocalDateTime updatedAt;

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}