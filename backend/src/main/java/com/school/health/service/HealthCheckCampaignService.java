package com.school.health.service;

import com.school.health.dto.request.HealthCampaignRequestDTO;
import com.school.health.dto.request.HealthCheckRequestDTO;
import com.school.health.dto.response.HealthCampaignResponseDTO;
import com.school.health.dto.response.HealthCheckResponseDTO;
import com.school.health.dto.response.StudentResponseDTO;
import com.school.health.entity.HealthCheckCampaign;
import com.school.health.enums.Status;

import java.time.LocalDate;
import java.util.List;


public interface HealthCheckCampaignService {
    HealthCampaignResponseDTO createCampaign(HealthCampaignRequestDTO healthCampaignRequestDTO, int createdBy);

    List<HealthCampaignResponseDTO> getAllCampaigns();

    HealthCampaignResponseDTO getCampaignById(int campaignId);

    HealthCampaignResponseDTO updateCampaign(int campaignId, HealthCampaignRequestDTO healthCampaignRequestDTO);

    HealthCampaignResponseDTO approveCampaign(int campaignId, int approvedBy);

    HealthCampaignResponseDTO updateCampaignStatus(int campaignId, Status status);

    List<StudentResponseDTO> getStudentsRegistrations(int campaignId);

    List<HealthCampaignResponseDTO> getApprovedCampaigns();

    HealthCheckResponseDTO registerStudentHealthCheck(HealthCheckRequestDTO request);

    List<HealthCheckCampaign> getMyChildHealthCampaigns(Integer parentId, Integer studentId);

    HealthCheckResponseDTO recordHealthCheckResult(Integer campaignId, HealthCheckRequestDTO requestDTO);

    HealthCheckResponseDTO updateStudentHealthCampaign(Integer healthcheckId ,HealthCheckRequestDTO requestDTO);

    List<HealthCheckResponseDTO> getHealthCheckResults(Integer campaignId);

    List<HealthCheckResponseDTO> getAllHealthCheckResults();

    List<HealthCheckResponseDTO> getResultByStudentId(Integer studentId);

    List<HealthCheckResponseDTO> getResultWithFilterDate(LocalDate startDate, LocalDate endDate,boolean consultationAppointment);

    HealthCheckResponseDTO rejectStudentVaccine(HealthCheckRequestDTO request);
}
