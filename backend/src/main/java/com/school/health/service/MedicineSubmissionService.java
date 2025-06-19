package com.school.health.service;

import com.school.health.dto.request.MedicineLogRequest;
import com.school.health.dto.request.MedicineSubmissionRequest;
import com.school.health.dto.request.StatusUpdateRequest;
import com.school.health.dto.response.*;

import java.util.List;

public interface MedicineSubmissionService {
    // PARENT operations
    MedicineSubmissionResponse createMedicineSubmission(MedicineSubmissionRequest request, Integer parentId);
    List<MedicineSubmissionResponse> getAllByParent(Integer parentId, Integer studentId, String status);
    List<StudentSummaryResponse> getChildrenByParent(Integer parentId);
    void deleteByParent(Integer id, Integer parentId);

    // NURSE operations
    List<MedicineSubmissionResponse> getAllForNurse(Integer studentId, Integer parentId, String status);
    HealthDashboardResponse getHealthDashboard();
    MedicineLogResponse markMedicineTaken(Integer submissionId, MedicineLogRequest request);
    MedicineSubmissionResponse getByIdForNurse(Integer id);

    // ADMIN operations
    List<MedicineSubmissionResponse> getAllForAdmin(Integer studentId, Integer parentId, String status);
    AdminDashboardResponse getAdminDashboard();

    // Common operations
    MedicineSubmissionResponse getById(Integer id);
    MedicineSubmissionResponse updateStatus(Integer id, StatusUpdateRequest request);
    void delete(Integer id);
}
