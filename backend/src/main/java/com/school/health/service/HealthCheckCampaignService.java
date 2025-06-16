package com.school.health.service;

import com.school.health.dto.request.HealthCampaignRequestDTO;
import com.school.health.dto.request.HealthCheckRequestDTO;
import com.school.health.dto.response.HealthCampaignResponseDTO;
import com.school.health.dto.response.HealthCheckResponseDTO;
import com.school.health.dto.response.StudentResponseDTO;
import com.school.health.entity.HealthCheckCampaign;
import com.school.health.entity.Student;
import com.school.health.enums.Status;
import org.springframework.stereotype.Service;

import java.util.List;


public interface HealthCheckCampaignService {
    HealthCampaignResponseDTO createCampaign(HealthCampaignRequestDTO healthCampaignRequestDTO,
                                             int createdBy);

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

    // update health check result
    HealthCheckResponseDTO updateStudentHealthCampaign(Integer healthcheckId ,HealthCheckRequestDTO requestDTO);
}
