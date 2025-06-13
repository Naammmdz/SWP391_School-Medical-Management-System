package com.school.health.service.impl;

import com.school.health.dto.request.VaccinationCampaignRequestDTO;
import com.school.health.dto.request.VaccinationRequestDTO;
import com.school.health.dto.response.StudentResponseDTO;
import com.school.health.dto.response.VaccinationCampaignResponseDTO;
import com.school.health.dto.response.VaccinationResponseDTO;
import com.school.health.entity.Student;
import com.school.health.entity.Vaccination;
import com.school.health.entity.VaccinationCampaign;
import com.school.health.enums.Status;
import com.school.health.repository.StudentRepository;
import com.school.health.repository.VaccinationCampaignRepository;
import com.school.health.repository.VaccinationRepository;
import com.school.health.service.VaccinationCampaignService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VaccinationCampaignServiceImpl implements VaccinationCampaignService {
    private final VaccinationCampaignRepository vaccinationCampaignRepository;
    private final VaccinationRepository vaccinationRepository;
    private final StudentRepository studentRepository;

    @Override
    public VaccinationCampaignResponseDTO createVaccinationCampaign(VaccinationCampaignRequestDTO vaccinationCampaignRequestDTO, int createdBy) {
        VaccinationCampaign campaign = mapToEntity(vaccinationCampaignRequestDTO);
        campaign.setCreatedBy(createdBy);
        VaccinationCampaign savedCampaign = vaccinationCampaignRepository.save(campaign);
        return mapToResponseDTO(savedCampaign);
    }

    // map Request DTO to Entity
    public VaccinationCampaign mapToEntity(VaccinationCampaignRequestDTO requestDTO) {
        VaccinationCampaign campaign = new VaccinationCampaign();
        campaign.setCampaignName(requestDTO.getCampaignName());
        campaign.setDescription(requestDTO.getDescription());
        campaign.setScheduledDate(requestDTO.getScheduledDate());
        campaign.setStatus(requestDTO.getStatus());
        return campaign;
    }

    public VaccinationCampaignResponseDTO mapToResponseDTO(VaccinationCampaign campaign) {
        VaccinationCampaignResponseDTO responseDTO = new VaccinationCampaignResponseDTO();
        responseDTO.setCampaignId(campaign.getCampaignId());
        responseDTO.setCampaignName(campaign.getCampaignName());
        responseDTO.setDescription(campaign.getDescription());
        responseDTO.setScheduledDate(campaign.getScheduledDate());
        responseDTO.setCreatedBy(campaign.getCreatedBy());
        responseDTO.setApprovedBy(campaign.getApprovedBy());
        responseDTO.setStatus(campaign.getStatus());
        responseDTO.setCreatedAt(campaign.getCreatedAt());
        return responseDTO;
    }

    @Override
    public List<VaccinationCampaignResponseDTO> getAllVaccinationCampaigns() {
        return vaccinationCampaignRepository.findAll().stream().map(this::mapToResponseDTO).collect(Collectors.toList());
    }

    @Override
    public VaccinationCampaignResponseDTO getVaccinationCampaignById(Integer campaignId) {
        VaccinationCampaign campaign = vaccinationCampaignRepository.findById(campaignId).orElseThrow(() -> new RuntimeException("Campaign not found id :" + campaignId));
        return mapToResponseDTO(campaign);
    }

    @Override
    public VaccinationCampaignResponseDTO updateVaccinationCampaign(Integer campaignId, VaccinationCampaignRequestDTO vaccinationCampaignRequestDTO) {
        VaccinationCampaign existingCampaign = vaccinationCampaignRepository.findById(campaignId).orElseThrow(() -> new RuntimeException("Campaign not found id :" + campaignId));

        existingCampaign.setCampaignName(vaccinationCampaignRequestDTO.getCampaignName());
        existingCampaign.setDescription(vaccinationCampaignRequestDTO.getDescription());
        existingCampaign.setScheduledDate(vaccinationCampaignRequestDTO.getScheduledDate());
        existingCampaign.setStatus(vaccinationCampaignRequestDTO.getStatus());

        VaccinationCampaign updatedCampaign = vaccinationCampaignRepository.save(existingCampaign);
        return mapToResponseDTO(updatedCampaign);
    }

    @Override
    public VaccinationCampaignResponseDTO approveVaccinationCampaign(Integer campaignId, int approvedBy) {
        VaccinationCampaign campaign = vaccinationCampaignRepository.findById(campaignId).orElseThrow(() -> new RuntimeException("Campaign not found id :" + campaignId));

        campaign.setApprovedBy(approvedBy);
        campaign.setStatus(Status.APPROVED);
        VaccinationCampaign approvedCampaign = vaccinationCampaignRepository.save(campaign);
        return mapToResponseDTO(approvedCampaign);
    }

    @Override
    public VaccinationCampaignResponseDTO updateVaccinationCampaignStatus(Integer campaignId, Status status) {
        VaccinationCampaign campaign = vaccinationCampaignRepository.findById(campaignId).orElseThrow(() -> new RuntimeException("Campaign not found id :" + campaignId));

        campaign.setStatus(status);
        VaccinationCampaign updatedCampaign = vaccinationCampaignRepository.save(campaign);
        return mapToResponseDTO(updatedCampaign);
    }

    @Override
    public List<StudentResponseDTO> getStudentsRegistrations(Integer campaignId) {
        VaccinationCampaign campaign = vaccinationCampaignRepository.findById(campaignId).orElseThrow(() -> new RuntimeException("Campaign not found id :" + campaignId));
        List<Student> students = vaccinationCampaignRepository.getStudentWithParentConfirmation(campaignId);
        if (students.isEmpty()) {
            throw new RuntimeException("No students registered for this campaign");
        }
        return students.stream().map(student -> {
            StudentResponseDTO dto = new StudentResponseDTO();
            dto.setStudentId(student.getStudentId());
            dto.setFullName(student.getFullName());
            dto.setDob(student.getDob());
            dto.setGender(student.getGender());
            dto.setClassName(student.getClassName());
            // Add more fields if needed
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public List<VaccinationCampaignResponseDTO> getApprovedVaccination() {
        return vaccinationCampaignRepository.findByStatus(Status.APPROVED).stream().map(this::mapToResponseDTO).collect(Collectors.toList());
    }

    @Override
    public VaccinationResponseDTO registerStudentVaccine(VaccinationRequestDTO vaccineRequest) {
        VaccinationCampaign campaign = vaccinationCampaignRepository.findById(vaccineRequest.getCampaignId()).orElseThrow(() -> new RuntimeException("Campaign not found id :" + vaccineRequest.getCampaignId()));
        Student student = studentRepository.findById(vaccineRequest.getStudentId()).orElseThrow(() -> new RuntimeException("Student not found id :" + vaccineRequest.getStudentId()));
        vaccineRequest.setParentConfirmation(true);
        Vaccination vaccination = mapToEntityVaccine(vaccineRequest);
        VaccinationResponseDTO responseDTO = mapToResponseDTO(vaccination);
        return responseDTO;
    }

    public Vaccination mapToEntityVaccine(VaccinationRequestDTO requestDTO) {
        Vaccination vaccination = new Vaccination();
        vaccination.setCampaign(vaccinationCampaignRepository.findById(requestDTO.getCampaignId()).orElseThrow(() -> new RuntimeException("Campaign not found id :" + requestDTO.getCampaignId())));
        vaccination.setStudent(studentRepository.findById(requestDTO.getStudentId()).orElseThrow(() -> new RuntimeException("Student not found id :" + requestDTO.getStudentId())));
        if (vaccinationRepository.existStudent(requestDTO.getStudentId(), requestDTO.getCampaignId()) != null) {
            throw new RuntimeException("Student already registered for this campaign");
        }
        vaccination.setVaccineName(requestDTO.getVaccineName());
        vaccination.setDate(requestDTO.getDate());
        vaccination.setNotes(requestDTO.getNotes());
        vaccination.setParentConfirmation(requestDTO.isParentConfirmation());
        vaccination.setResult(requestDTO.getResult());
        vaccinationRepository.save(vaccination);
        return vaccination;
    }

    public VaccinationResponseDTO mapToResponseDTO(Vaccination vaccination) {
        VaccinationResponseDTO responseDTO = new VaccinationResponseDTO();
        responseDTO.setCampaignId(vaccination.getCampaign().getCampaignId());
        responseDTO.setStudentId(vaccination.getStudent().getStudentId());
        responseDTO.setVaccineName(vaccination.getVaccineName());
        responseDTO.setDate(vaccination.getDate());
        responseDTO.setNotes(vaccination.getNotes());
        responseDTO.setParentConfirmation(vaccination.isParentConfirmation());
        responseDTO.setResult(vaccination.getResult());
        return responseDTO;
    }

    @Override
    public boolean isParentOfStudent(Integer parentId, Integer studentId) {
        return vaccinationRepository.existsByStudentStudentIdAndStudentParentUserId(parentId, studentId);
    }

}



