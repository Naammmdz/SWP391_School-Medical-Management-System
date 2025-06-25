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
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
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
        campaign.setTargetGroup(requestDTO.getTargetGroup());
        campaign.setType(requestDTO.getType());
        campaign.setAddress(requestDTO.getAddress());
        campaign.setOrganizer(requestDTO.getOrganizer());


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
        responseDTO.setTargetGroup(campaign.getTargetGroup());
        responseDTO.setType(campaign.getType());
        responseDTO.setAddress(campaign.getAddress());
        responseDTO.setOrganizer(campaign.getOrganizer());
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
        existingCampaign.setTargetGroup(vaccinationCampaignRequestDTO.getTargetGroup());
        existingCampaign.setType(vaccinationCampaignRequestDTO.getType());
        existingCampaign.setAddress(vaccinationCampaignRequestDTO.getAddress());
        existingCampaign.setOrganizer(vaccinationCampaignRequestDTO.getOrganizer());

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
    // rejectStudentVaccine
    @Override
    public VaccinationResponseDTO rejectStudentVaccine(VaccinationRequestDTO vaccineRequest) {
        VaccinationCampaign campaign = vaccinationCampaignRepository.findById(vaccineRequest.getCampaignId()).orElseThrow(() -> new RuntimeException("Campaign not found id :" + vaccineRequest.getCampaignId()));
        Student student = studentRepository.findById(vaccineRequest.getStudentId()).orElseThrow(() -> new RuntimeException("Student not found id :" + vaccineRequest.getStudentId()));
        vaccineRequest.setParentConfirmation(false);
        Vaccination vaccination = mapToEntityVaccine(vaccineRequest);
        VaccinationResponseDTO responseDTO = mapToResponseDTO(vaccination);
        return responseDTO;
    }


    public Vaccination mapToEntityVaccine(VaccinationRequestDTO requestDTO) {
        Vaccination vaccination = new Vaccination();
        vaccination.setCampaign(vaccinationCampaignRepository.findById(requestDTO.getCampaignId()).orElseThrow(() -> new RuntimeException("Campaign not found id :" + requestDTO.getCampaignId())));
        vaccination.setStudent(studentRepository.findById(requestDTO.getStudentId()).orElseThrow(() -> new RuntimeException("Student not found id :" + requestDTO.getStudentId())));
        vaccination.setVaccineName(requestDTO.getVaccineName());
        vaccination.setDate(requestDTO.getDate());
        vaccination.setNotes(requestDTO.getNotes());
        vaccination.setDoseNumber(requestDTO.getDoseNumber());
        vaccination.setAdverseReaction(requestDTO.getAdverseReaction());
        vaccination.setPreviousDose(requestDTO.isPreviousDose());
        vaccination.setParentConfirmation(requestDTO.isParentConfirmation());
        vaccination.setResult(requestDTO.getResult());
        vaccinationRepository.save(vaccination);
        return vaccination;
    }

    public VaccinationResponseDTO mapToResponseDTO(Vaccination vaccination) {
        VaccinationResponseDTO responseDTO = new VaccinationResponseDTO();
        responseDTO.setVaccinationId(vaccination.getVaccinationId());
        responseDTO.setCampaignId(vaccination.getCampaign().getCampaignId());
        responseDTO.setStudentId(vaccination.getStudent().getStudentId());
        responseDTO.setVaccineName(vaccination.getVaccineName());
        responseDTO.setDate(vaccination.getDate());
        responseDTO.setDoseNumber(vaccination.getDoseNumber());
        responseDTO.setAdverseReaction(vaccination.getAdverseReaction());
        responseDTO.setPreviousDose(vaccination.isPreviousDose());
        responseDTO.setNotes(vaccination.getNotes());
        responseDTO.setParentConfirmation(vaccination.isParentConfirmation());
        responseDTO.setResult(vaccination.getResult());
        return responseDTO;
    }


    @Override
    public boolean isParentOfStudent(Integer parentId, Integer studentId) {
        return vaccinationRepository.existsByStudentStudentIdAndStudentParentUserId(parentId, studentId);
    }

    @Override
    public List<VaccinationCampaign> getMyChildHealthCampaigns(Integer parentId, Integer studentId) {
        return vaccinationCampaignRepository.findCampaignsByStudentId(studentId);
    }

    @Override
    public VaccinationResponseDTO recordVaccinationResult(Integer campaignId, VaccinationRequestDTO requestDTO) {
        VaccinationCampaign campaign = vaccinationCampaignRepository.findById(campaignId).orElseThrow(() -> new RuntimeException("Campaign not found id :" + campaignId));
        Student student = studentRepository.findById(requestDTO.getStudentId()).orElseThrow(() -> new RuntimeException("Student not found id :" + requestDTO.getStudentId()));
        // check học sinh đã tồn tại trong chiến dịch tiêm chủng chưa
        Vaccination vaccination = mapToEntityVaccine(requestDTO);
        vaccination.setCampaign(campaign);
        vaccinationRepository.save(vaccination);
        return mapToResponseDTO(vaccination);
    }

    @Override
    public VaccinationResponseDTO updateStudentVaccinationCampaign(Integer vaccinationId, VaccinationRequestDTO requestDTO) {
        Vaccination vaccination = vaccinationRepository.findById(vaccinationId).orElseThrow(() -> new RuntimeException("Vaccination not found id :" + vaccinationId));
        VaccinationCampaign campaign = vaccinationCampaignRepository.findById(requestDTO.getCampaignId()).orElseThrow(() -> new RuntimeException("Campaign not found id :" + requestDTO.getCampaignId()));
        Student student = studentRepository.findById(requestDTO.getStudentId()).orElseThrow(() -> new RuntimeException("Student not found id :" + requestDTO.getStudentId()));
        vaccination.setDate(requestDTO.getDate());
        vaccination.setDoseNumber(requestDTO.getDoseNumber());
        vaccination.setAdverseReaction(requestDTO.getAdverseReaction());
        vaccination.setPreviousDose(requestDTO.isPreviousDose());
        vaccination.setNotes(requestDTO.getNotes());
        vaccination.setParentConfirmation(requestDTO.isParentConfirmation());
        vaccination.setResult(requestDTO.getResult());
        vaccination.setVaccineName(requestDTO.getVaccineName());
        vaccination.setCampaign(campaign);
        vaccination.setStudent(student);
        vaccinationRepository.save(vaccination);
        return mapToResponseDTO(vaccination);
    }

    @Override
    public List<VaccinationResponseDTO> getAllVaccinationResults() {
        return vaccinationRepository.findAll().stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<VaccinationResponseDTO> getVaccinationResults(Integer campaignId) {
        return vaccinationRepository.findByCampaignId(campaignId).stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<VaccinationResponseDTO> getResultByStudentId(Integer studentId) {
        List<Vaccination> vaccine = vaccinationRepository.findByStudentId(studentId);
        if(vaccine.isEmpty()){
            throw new RuntimeException("Vaccination not found : " + studentId);
        }
        return vaccine.stream().map(this::mapToResponseDTO).collect(Collectors.toList());
    }

    @Override
    public List<VaccinationResponseDTO> getResultWithFilterDate(LocalDate startDate, LocalDate endDate) {
        return vaccinationRepository.findResultWithDate( startDate, endDate ).stream().map(this::mapToResponseDTO).collect(Collectors.toList());
    }

    @Override
    public List<VaccinationCampaignResponseDTO> getCampaignStatus(int studentId, boolean parentConfirmation) {
        List<VaccinationCampaign> campaign = vaccinationCampaignRepository.findCampaignsByStudentIdAndParentConfirmation(studentId,parentConfirmation);
        if (campaign.isEmpty()) {
            throw new RuntimeException("No health campaigns found for student with ID: " + studentId + " and parent confirmation: " + parentConfirmation);
        }
        return campaign.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<VaccinationResponseDTO> filterVaccinationCampaigns(String className, String campaignName, String studentName, LocalDate startDate, LocalDate endDate) {
        Specification<Vaccination> spec = Specification.where(null);

        if (className != null && !className.isBlank()) {
            spec = spec.and((root, query, cb) ->
                    cb.equal(root.get("student").get("className"), className));
        }

        if (campaignName != null && !campaignName.isBlank()) {
            spec = spec.and((root, query, cb) ->
                    cb.equal(root.get("campaign").get("campaignName"), campaignName));
        }

        if (studentName != null && !studentName.isBlank()) {
            spec = spec.and((root, query, cb) ->
                    cb.like(cb.lower(root.get("student").get("fullName")), "%" + studentName.toLowerCase() + "%"));
        }

        if (startDate != null && endDate != null) {
            spec = spec.and((root, query, cb) ->
                    cb.greaterThanOrEqualTo(root.get("date"), startDate));
        }

        if (endDate != null && startDate != null) {
            spec = spec.and((root, query, cb) ->
                    cb.lessThanOrEqualTo(root.get("date"), endDate));
        }

        return vaccinationRepository.findAll(spec)
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<VaccinationResponseDTO> getAllVaccinationResultsWithParentConfirmationTrue() {
        return vaccinationRepository.findAll().stream()
                .map(this::mapToResponseDTO)
                .filter(a -> a.isParentConfirmation()) // Nếu ở đây không có get true hay false
                // thì mặc định là true tại vì a.isParentConfirmation() trả về true nếu muốn trả về false
                // thì phải dùng a.isParentConfirmation() == false
                .collect(Collectors.toList());
    }
}


