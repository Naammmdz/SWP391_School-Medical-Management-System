package com.school.health.repository;

import com.school.health.entity.MedicineDetail;
import com.school.health.entity.MedicineSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicineSubmissionRepository extends JpaRepository<MedicineDetail, Integer> {
    List<MedicineSubmission> findByStudentId(Integer studentId);
    List<MedicineSubmission> findByParentId(Integer parentId);
    List<MedicineSubmission> findBySubmissionStatus(Integer submissionStatus);
}
