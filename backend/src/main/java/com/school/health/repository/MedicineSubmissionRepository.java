package com.school.health.repository;

import com.school.health.entity.MedicineSubmission;
import com.school.health.enums.MedicineSubmissionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicineSubmissionRepository extends JpaRepository<MedicineSubmission, Integer> {
    List<MedicineSubmission> findByStudent_StudentId(Integer studentId);
    List<MedicineSubmission> findByParent_UserId(Integer parentId);
    List<MedicineSubmission> findBySubmissionStatus(MedicineSubmissionStatus submissionStatus);
}
