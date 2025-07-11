package com.school.health.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Table(name = "MedicineLog")
@Data
public class MedicineLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MedicineLogId")
    private  Integer medicineLogId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MedicineSubmissionId", referencedColumnName = "MedicineSubmissionId", nullable = false)
    private MedicineSubmission medicineSubmission;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "GivenByUserId", referencedColumnName = "UserId", nullable = true)
    private User givenBy;

    @Column(name = "GivenAt", nullable = false)
    private LocalDate givenAt;

    @Column(name = "Notes", length = 500)
    private String notes;

    @Column(name = "Status")
    private Boolean status = null;

    @Column(name = "ImageData", columnDefinition = "TEXT")
    private String imageData; // Base64 encoded image


}
