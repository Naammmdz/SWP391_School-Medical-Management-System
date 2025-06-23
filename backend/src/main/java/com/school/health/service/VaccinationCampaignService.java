package com.school.health.service;

import com.school.health.dto.request.VaccinationCampaignRequestDTO;
import com.school.health.dto.request.VaccinationRequestDTO;
import com.school.health.dto.response.StudentResponseDTO;
import com.school.health.dto.response.VaccinationCampaignResponseDTO;
import com.school.health.dto.response.VaccinationResponseDTO;
import com.school.health.entity.VaccinationCampaign;
import com.school.health.enums.Status;

import java.time.LocalDate;
import java.util.List;

public interface VaccinationCampaignService {


    VaccinationCampaignResponseDTO createVaccinationCampaign(VaccinationCampaignRequestDTO vaccinationCampaignRequestDTO, int createdBy);

    List<VaccinationCampaignResponseDTO> getAllVaccinationCampaigns();

    VaccinationCampaignResponseDTO getVaccinationCampaignById(Integer campaignId);

    VaccinationCampaignResponseDTO updateVaccinationCampaign(Integer campaignId, VaccinationCampaignRequestDTO vaccinationCampaignRequestDTO);

    VaccinationCampaignResponseDTO approveVaccinationCampaign(Integer campaignId, int approvedBy);

    VaccinationCampaignResponseDTO updateVaccinationCampaignStatus(Integer campaignId, Status status);

    List<StudentResponseDTO> getStudentsRegistrations(Integer campaignId);

    List<VaccinationCampaignResponseDTO> getApprovedVaccination();

    VaccinationResponseDTO registerStudentVaccine(VaccinationRequestDTO request);

    boolean isParentOfStudent(Integer parentId, Integer studentId);

    List<VaccinationCampaign> getMyChildHealthCampaigns(Integer parentId, Integer studentId);

    VaccinationResponseDTO recordVaccinationResult(Integer campaignId, VaccinationRequestDTO requestDTO);

    VaccinationResponseDTO updateStudentVaccinationCampaign(Integer vaccinationId, VaccinationRequestDTO requestDTO);

    List<VaccinationResponseDTO> getAllVaccinationResults();

    List<VaccinationResponseDTO> getVaccinationResults(Integer campaignId);

    List<VaccinationResponseDTO> getResultByStudentId(Integer studentId);

    List<VaccinationResponseDTO> getResultWithFilterDate(LocalDate startDate, LocalDate endDate);

    VaccinationResponseDTO rejectStudentVaccine(VaccinationRequestDTO vaccineRequest);

    List<VaccinationCampaignResponseDTO> getCampaignStatus(int studentId, boolean parentConfirmation);

}
