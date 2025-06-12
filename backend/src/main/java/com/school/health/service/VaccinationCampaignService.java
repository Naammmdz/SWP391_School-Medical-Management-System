package com.school.health.service;

import com.school.health.dto.request.VaccinationCampaignRequestDTO;
import com.school.health.dto.response.StudentResponseDTO;
import com.school.health.dto.response.VaccinationCampaignResponseDTO;
import com.school.health.entity.Student;
import com.school.health.enums.Status;

import java.util.List;

public interface VaccinationCampaignService {


    VaccinationCampaignResponseDTO createVaccinationCampaign(VaccinationCampaignRequestDTO vaccinationCampaignRequestDTO, int createdBy);
    List<VaccinationCampaignResponseDTO> getAllVaccinationCampaigns();
    VaccinationCampaignResponseDTO getVaccinationCampaignById(Integer campaignId);
    VaccinationCampaignResponseDTO updateVaccinationCampaign(Integer campaignId, VaccinationCampaignRequestDTO vaccinationCampaignRequestDTO);
    VaccinationCampaignResponseDTO approveVaccinationCampaign(Integer campaignId, int approvedBy);
    VaccinationCampaignResponseDTO updateVaccinationCampaignStatus(Integer campaignId, Status status);
    List<StudentResponseDTO> getStudentsRegistrations(Integer campaignId);
}
