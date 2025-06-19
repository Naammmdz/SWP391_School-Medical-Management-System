package com.school.health.entity;

import com.school.health.enums.MedicineSubmissionStatus;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "MedicineSubmission")
@Data
public class MedicineSubmission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MedicineSubmissionId")
    private Integer medicineSubmissionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "StudentId", referencedColumnName = "StudentId", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ParentId", referencedColumnName = "UserId", nullable = false)
    private User parent;

    @CreationTimestamp
    @Column(name = "SubmissionDate", length = 1000,nullable = false)
    private LocalDate submissionDate;

    @Column(name = "Instruction", length = 255)
    private String instruction;

    @Column(name = "Duration")
    private Integer duration;

    @Column(name = "StartDate")
    private LocalDate startDate;

    @Column(name = "EndDate")
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "SubmissionStatus", nullable = false, length = 20)
    private MedicineSubmissionStatus submissionStatus;

    @Column(name = "Notes", length = 500)
    private String notes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ApprovedBy", referencedColumnName = "UserId")
    private User approvedBy;

    @Column(name = "ApprovedAt")
    private LocalDate approvedAt;

    @CreationTimestamp
    @Column(name = "CreatedAt")
    private LocalDate createdAt;

//    @OneToMany(mappedBy = "medicineSubmission", cascade = CascadeType.ALL, orphanRemoval = true)
//    private List<MedicineDetail> medicineDetails;

    @OneToMany(mappedBy = "medicineSubmission", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MedicineLog> medicineLogs;

    public void addMedicineLog(MedicineLog log) {
        if (medicineLogs == null) {
            medicineLogs = new ArrayList<>();
        }
        medicineLogs.add(log);
        log.setMedicineSubmission(this);
    }

    public void removeMedicineLog(MedicineLog log) {
        medicineLogs.remove(log);
        log.setMedicineSubmission(null);
    }
}
