package com.school.health.service;

import com.school.health.dto.request.HealthCampaignRequestDTO;
import com.school.health.dto.request.HealthCheckRequestDTO;
import com.school.health.dto.response.*;
import com.school.health.entity.HealthCheckCampaign;
import com.school.health.enums.Status;

import java.time.LocalDate;
import java.util.List;


public interface HealthCheckCampaignService {
    HealthCampaignResponseDTO createCampaign(HealthCampaignRequestDTO healthCampaignRequestDTO, int createdBy);

    List<HealthCampaignResponseDTO> getAllCampaigns();

    HealthCampaignResponseDTO getCampaignById(int campaignId);

    HealthCampaignResponseDTO updateCampaign(int campaignId, HealthCampaignRequestDTO healthCampaignRequestDTO);

    HealthCampaignResponseDTO approveCampaign(int campaignId, int approvedBy, Status status, String rejectionReason);

    HealthCampaignResponseDTO updateCampaignStatus(int campaignId, Status status);

    List<StudentResponseDTO> getStudentsRegistrations(int campaignId);

    List<HealthV2CampaignResponseDTO> getApprovedCampaigns(int parentId);

    HealthCheckResponseDTO registerStudentHealthCheck(HealthCheckRequestDTO request);

    List<HealthCheckCampaign> getMyChildHealthCampaigns(Integer parentId, Integer studentId);

    HealthCheckResponseDTO recordHealthCheckResult(Integer campaignId, HealthCheckRequestDTO requestDTO);

    HealthCheckResponseDTO updateStudentHealthCampaign(Integer healthcheckId, HealthCheckRequestDTO requestDTO);

    List<HealthCheckResponseDTO> getHealthCheckResults(Integer campaignId);

    List<HealthCheckResponseDTO> getAllHealthCheckResults();

    List<HealthCheckResponseDTO> getResultByStudentId(Integer studentId);


    List<HealthCheckResponseDTO> getResultWithFilterDate(LocalDate startDate, LocalDate endDate, boolean consultationAppointment);

    HealthCheckResponseDTO rejectStudentVaccine(HealthCheckRequestDTO request);

    List<HealthCampaignResponseDTO> getCampaignStatus(int studentId, boolean parentConfirmation);

    List<HealthCampaignIsAcceptDTO> getCampaignsIsAcceptOrReject(Integer studentId);

    List<HealthCheckResponseResultDTO> filterHealthCheckCampaigns(String className, String campaignName, String studentName, Boolean isParentConfirmation, LocalDate startDate, LocalDate endDate);

    List<HealthCheckResponseDTO> getAllHealthCheckResultsWithParentConfirmationTrue();

}
