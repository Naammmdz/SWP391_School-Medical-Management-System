package com.school.health.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "MedicineSubmission")
public class MedicineSubmission {

    @Id
    @GeneratedValue
    private Integer medicineSubmissionId;
    private Integer studentId;
    private Integer parentId;
    private LocalDate submitDate;
    private List<String> medicineName;
    private List<String> medicineDosage;


}
