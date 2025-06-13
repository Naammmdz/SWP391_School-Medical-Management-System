package com.school.health.service.impl;

import com.school.health.dto.request.HealthCampaignRequestDTO;
import com.school.health.dto.request.HealthCheckRequestDTO;
import com.school.health.dto.response.HealthCampaignResponseDTO;
import com.school.health.dto.response.HealthCheckResponseDTO;
import com.school.health.dto.response.StudentResponseDTO;
import com.school.health.entity.HealthCheck;
import com.school.health.entity.HealthCheckCampaign;
import com.school.health.entity.Student;
import com.school.health.enums.Status;
import com.school.health.repository.HealthCheckCampaignRepository;
import com.school.health.repository.HealthCheckRepository;
import com.school.health.repository.StudentRepository;
import com.school.health.service.HealthCheckCampaignService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HealthCheckCampaignServiceImpl implements HealthCheckCampaignService {

    private final HealthCheckCampaignRepository healthCheckCampaignRepository;
    private final HealthCheckRepository healthCheckRepository;
    private final StudentRepository studentRepository;

    @Override
    public HealthCampaignResponseDTO createCampaign(HealthCampaignRequestDTO healthCampaignRequestDTO, int createdBy) {
        HealthCheckCampaign campaign = mapToEntity(healthCampaignRequestDTO);
        campaign.setCreatedBy(createdBy);
        HealthCheckCampaign savedCampaign = healthCheckCampaignRepository.save(campaign);
        return mapToResponseDTO(savedCampaign);
    }

    public HealthCheckCampaign mapToEntity(HealthCampaignRequestDTO requestDTO) {
        HealthCheckCampaign campaign = new HealthCheckCampaign();
        campaign.setCampaignName(requestDTO.getCampaignName());
        campaign.setDescription(requestDTO.getDescription());
        campaign.setScheduledDate(requestDTO.getScheduledDate());
        campaign.setStatus(requestDTO.getStatus());
        return campaign;
    }

    public HealthCampaignResponseDTO mapToResponseDTO(HealthCheckCampaign campaign) {
        HealthCampaignResponseDTO responseDTO = new HealthCampaignResponseDTO();
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
    public List<HealthCampaignResponseDTO> getAllCampaigns() {
        return healthCheckCampaignRepository.findAll().stream().map(this::mapToResponseDTO).collect(Collectors.toList());
        // giải thích đoạn return ở đây
        // Dòng này lấy tất cả các chiến dịch sức khỏe từ cơ sở dữ liệu,
        // chuyển đổi từng chiến dịch thành đối tượng HealthCampaignResponseDTO
        // và trả về danh sách các đối tượng này.
        // Sử dụng stream để thực hiện việc chuyển đổi và thu thập kết quả vào một danh sách.
        // .map là một phương thức trong Stream API của Java
        // được sử dụng để chuyển đổi từng phần tử trong stream thành một giá trị khác.
        // .collect là một phương thức trong Stream API của Java
        // được sử dụng để thu thập các phần tử trong stream thành một danh sách (hoặc một cấu trúc dữ liệu khác).
    }

    @Override
    public HealthCampaignResponseDTO getCampaignById(int campaignId) {
        HealthCheckCampaign campaign = healthCheckCampaignRepository.findById(campaignId).orElseThrow(() -> new RuntimeException("Campaign not found with ID: " + campaignId));
        return mapToResponseDTO(campaign);
    }

    @Override
    public HealthCampaignResponseDTO updateCampaign(int campaignId, HealthCampaignRequestDTO healthCampaignRequestDTO) {
        HealthCheckCampaign existingCampaign = healthCheckCampaignRepository.findById(campaignId).orElseThrow(() -> new RuntimeException("Campaign not found with ID: " + campaignId));

        existingCampaign.setCampaignName(healthCampaignRequestDTO.getCampaignName());
        existingCampaign.setDescription(healthCampaignRequestDTO.getDescription());
        existingCampaign.setScheduledDate(healthCampaignRequestDTO.getScheduledDate());
        existingCampaign.setStatus(healthCampaignRequestDTO.getStatus());

        HealthCheckCampaign updatedCampaign = healthCheckCampaignRepository.save(existingCampaign);
        return mapToResponseDTO(updatedCampaign);
    }

    @Override
    public HealthCampaignResponseDTO approveCampaign(int campaignId, int approvedBy) {
        HealthCheckCampaign existingCampaign = healthCheckCampaignRepository.findById(campaignId).orElseThrow(() -> new RuntimeException("Campaign not found with ID: " + campaignId));

        existingCampaign.setApprovedBy(approvedBy);
        existingCampaign.setStatus(Status.APPROVED); // Set status thành approved

        HealthCheckCampaign updatedCampaign = healthCheckCampaignRepository.save(existingCampaign);
        return mapToResponseDTO(updatedCampaign);
    }

    @Override
    public HealthCampaignResponseDTO updateCampaignStatus(int campaignId, Status status) {
        HealthCheckCampaign existingCampaign = healthCheckCampaignRepository.findById(campaignId).orElseThrow(() -> new RuntimeException("Campaign not found with ID: " + campaignId));

        existingCampaign.setStatus(status);

        HealthCheckCampaign updatedCampaign = healthCheckCampaignRepository.save(existingCampaign);
        return mapToResponseDTO(updatedCampaign);
    }

    // Phương thức này có thể được sử dụng để lấy danh sách học sinh đã đăng ký trong chiến dịch sức khỏe
    @Override
    public List<StudentResponseDTO> getStudentsRegistrations(int campaignId) {
        // Kiểm tra xem chiến dịch có tồn tại không
        HealthCheckCampaign campaign = healthCheckCampaignRepository.findById(campaignId).orElseThrow(() -> new RuntimeException("Campaign not found with ID: " + campaignId));
        List<Student> students = healthCheckCampaignRepository.findStudentWithParentConfirmationInCampaign(campaignId);
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
    public List<HealthCampaignResponseDTO> getApprovedCampaigns() {
        List<HealthCheckCampaign> approvedCampaigns = healthCheckCampaignRepository.findByStatus(Status.APPROVED);
        return approvedCampaigns.stream().map(this::mapToResponseDTO).collect(Collectors.toList());
    }

    @Override
    public HealthCheckResponseDTO registerStudentHealthCheck(HealthCheckRequestDTO request) {
        HealthCheckCampaign campaign = healthCheckCampaignRepository.findById(request.getCampaignId()).orElseThrow(() -> new RuntimeException("Campaign not found with ID: " + request.getCampaignId()));
        Student student = studentRepository.findById(request.getStudentId()).orElseThrow(() -> new RuntimeException("Student not found with ID: " + request.getStudentId()));
        request.setParentConfirmation(true);
        HealthCheck healthCheckEntity = maptoEntityCheck(request);
        HealthCheckResponseDTO responseDTO = mapToHealthCheckResponseDTO(healthCheckEntity);
        return responseDTO;
    }

    public HealthCheck maptoEntityCheck(HealthCheckRequestDTO request) {
        HealthCheck healthcheck = new HealthCheck();
        healthcheck.setCampaign(healthCheckCampaignRepository.findById(request.getCampaignId()).orElseThrow(() -> new RuntimeException("Campaign not found with ID: " + request.getCampaignId())));
        healthcheck.setStudent(studentRepository.findById(request.getStudentId()).orElseThrow(() -> new RuntimeException("Student not found with ID: " + request.getStudentId())));
        healthcheck.setDate(request.getDate());
        healthcheck.setEyesight(request.getEyesight());
        healthcheck.setHearing(request.getHearing());
        healthcheck.setHeight(request.getHeight());
        healthcheck.setWeight(request.getWeight());
        healthcheck.setNotes(request.getNotes());
        healthcheck.setParentConfirmation(request.isParentConfirmation());
        healthCheckRepository.save(healthcheck);
        return healthcheck;

    }

    public HealthCheckResponseDTO mapToHealthCheckResponseDTO(HealthCheck healthCheck) {
        HealthCheckResponseDTO responseDTO = new HealthCheckResponseDTO();
        responseDTO.setCampaignId(healthCheck.getCampaign().getCampaignId());
        responseDTO.setStudentId(healthCheck.getStudent().getStudentId());
        responseDTO.setDate(healthCheck.getDate());
        responseDTO.setEyesight(healthCheck.getEyesight());
        responseDTO.setHearing(healthCheck.getHearing());
        responseDTO.setHeight(healthCheck.getHeight());
        responseDTO.setWeight(healthCheck.getWeight());
        responseDTO.setNotes(healthCheck.getNotes());
        responseDTO.setParentConfirmation(healthCheck.isParentConfirmation());
        return responseDTO;
    }
}

