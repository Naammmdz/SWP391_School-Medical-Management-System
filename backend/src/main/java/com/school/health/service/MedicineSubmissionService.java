package com.school.health.service;

import com.school.health.dto.request.MedicineSubmissionRequest;
import com.school.health.dto.request.StatusUpdateRequest;
import com.school.health.dto.response.MedicineSubmissionResponse;
import com.school.health.entity.MedicineSubmission;

import java.util.List;

public interface MedicineSubmissionService {
    MedicineSubmission createMedicineSubmission(MedicineSubmissionRequest request);
    List<MedicineSubmissionResponse> getAllMedicineSubmissions(Integer studentId, Integer parentId, Integer submissionStatus);
    MedicineSubmissionResponse getMedicineSubmissionById(Integer submissionId);
    MedicineSubmissionResponse updateStatus(Integer id, StatusUpdateRequest request);
    void deleteMedicineSubmission(Integer submissionId);
}
