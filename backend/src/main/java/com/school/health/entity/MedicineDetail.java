package com.school.health.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "MedicineDetail")
public class MedicineDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MedicineDetailId")
    private Integer id;

    @Column(name = "MedicineName", nullable = false, length = 100)
    private String medicineName;

    @Column(name = "MedicineDosage", nullable = false, length = 100)
    private String medicineDosage;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MedicineSubmissionId", nullable = false)
    private MedicineSubmission medicineSubmission;
}
