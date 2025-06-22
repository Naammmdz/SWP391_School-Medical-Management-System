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
        campaign.setTargetGroup(requestDTO.getTargetGroup());
        campaign.setType(requestDTO.getType());
        campaign.setAddress(requestDTO.getAddress());
        campaign.setOrganizer(requestDTO.getOrganizer());
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
        responseDTO.setTargetGroup(campaign.getTargetGroup());
        responseDTO.setType(campaign.getType());
        responseDTO.setAddress(campaign.getAddress());
        responseDTO.setOrganizer(campaign.getOrganizer());
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
        existingCampaign.setTargetGroup(healthCampaignRequestDTO.getTargetGroup());
        existingCampaign.setType(healthCampaignRequestDTO.getType());
        existingCampaign.setAddress(healthCampaignRequestDTO.getAddress());
        existingCampaign.setOrganizer(healthCampaignRequestDTO.getOrganizer());

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

    @Override
    public HealthCheckResponseDTO rejectStudentVaccine(HealthCheckRequestDTO request) {
        HealthCheckCampaign campaign = healthCheckCampaignRepository.findById(request.getCampaignId()).orElseThrow(() -> new RuntimeException("Campaign not found with ID: " + request.getCampaignId()));
        Student student = studentRepository.findById(request.getStudentId()).orElseThrow(() -> new RuntimeException("Student not found with ID: " + request.getStudentId()));
        request.setParentConfirmation(false);
        HealthCheck healthCheckEntity = maptoEntityCheck(request);
        HealthCheckResponseDTO responseDTO = mapToHealthCheckResponseDTO(healthCheckEntity);
        return responseDTO;
    }

    public HealthCheck maptoEntityCheck(HealthCheckRequestDTO request) {
        HealthCheck healthcheck = new HealthCheck();
        healthcheck.setCampaign(healthCheckCampaignRepository.findById(request.getCampaignId()).orElseThrow(() -> new RuntimeException("Campaign not found with ID: " + request.getCampaignId())));
        healthcheck.setStudent(studentRepository.findById(request.getStudentId()).orElseThrow(() -> new RuntimeException("Student not found with ID: " + request.getStudentId())));
        healthcheck.setDate(request.getDate());
        healthcheck.setEyesightLeft(request.getEyesightLeft());
        healthcheck.setEyesightRight(request.getEyesightRight());
        healthcheck.setHearingLeft(request.getHearingLeft());
        healthcheck.setHearingRight(request.getHearingRight());
        healthcheck.setBloodPressure(request.getBloodPressure());
        healthcheck.setTemperature(request.getTemperature());
        healthcheck.setConsultationAppointment(request.isConsultationAppointment());
        healthcheck.setHeight(request.getHeight());
        healthcheck.setWeight(request.getWeight());
        healthcheck.setNotes(request.getNotes());
        healthcheck.setParentConfirmation(request.isParentConfirmation());
        healthCheckRepository.save(healthcheck);
        return healthcheck;

    }


    public HealthCheckResponseDTO mapToHealthCheckResponseDTO(HealthCheck healthCheck) {
        HealthCheckResponseDTO responseDTO = new HealthCheckResponseDTO();
        responseDTO.setHealthCheckId(healthCheck.getCheckId());
        responseDTO.setCampaignId(healthCheck.getCampaign().getCampaignId());
        responseDTO.setStudentId(healthCheck.getStudent().getStudentId());
        responseDTO.setDate(healthCheck.getDate());
        responseDTO.setHeight(healthCheck.getHeight());
        responseDTO.setWeight(healthCheck.getWeight());
        responseDTO.setEyesightLeft(healthCheck.getEyesightLeft());
        responseDTO.setEyesightRight(healthCheck.getEyesightRight());
        responseDTO.setHearingLeft(healthCheck.getHearingLeft());
        responseDTO.setHearingRight(healthCheck.getHearingRight());
        responseDTO.setBloodPressure(healthCheck.getBloodPressure());
        responseDTO.setTemperature(healthCheck.getTemperature());
        responseDTO.setConsultationAppointment(healthCheck.isConsultationAppointment());
        responseDTO.setNotes(healthCheck.getNotes());
        responseDTO.setParentConfirmation(healthCheck.isParentConfirmation());
        return responseDTO;
    }


    @Override
    public List<HealthCheckCampaign> getMyChildHealthCampaigns(Integer parentId, Integer studentId) {
        return healthCheckCampaignRepository.findCampaignsByStudentId(studentId);
        // Chuyển đổi danh sách HealthCheck thành HealthCampaignResponseDTO
    }

    @Override
    public HealthCheckResponseDTO recordHealthCheckResult(Integer campaignId, HealthCheckRequestDTO requestDTO) {
        HealthCheckCampaign campaign = healthCheckCampaignRepository.findById(campaignId).orElseThrow(() -> new RuntimeException("Campaign not found with ID: " + campaignId));
        HealthCheck healthCheck = maptoEntityCheck(requestDTO);
        healthCheck.setCampaign(campaign);
        healthCheckRepository.save(healthCheck);
        return mapToHealthCheckResponseDTO(healthCheck);
    }

    @Override
    public HealthCheckResponseDTO updateStudentHealthCampaign(Integer healthcheckId,HealthCheckRequestDTO requestDTO) {
        HealthCheck healthCheck = healthCheckRepository.findById(healthcheckId).orElseThrow(() -> new RuntimeException("Health check not found with ID: " + healthcheckId));
        HealthCheckCampaign campaign = healthCheckCampaignRepository.findById(requestDTO.getCampaignId()).orElseThrow(() -> new RuntimeException("Campaign not found with ID: " + requestDTO.getCampaignId()));
        Student student = studentRepository.findById(requestDTO.getStudentId()).orElseThrow(() -> new RuntimeException("Student not found with ID: " + requestDTO.getStudentId()));
        healthCheck.setDate(requestDTO.getDate());
        healthCheck.setHeight(requestDTO.getHeight());
        healthCheck.setWeight(requestDTO.getWeight());
        healthCheck.setEyesightLeft(requestDTO.getEyesightLeft());
        healthCheck.setEyesightRight(requestDTO.getEyesightRight());
        healthCheck.setHearingLeft(requestDTO.getHearingLeft());
        healthCheck.setHearingRight(requestDTO.getHearingRight());
        healthCheck.setBloodPressure(requestDTO.getBloodPressure());
        healthCheck.setTemperature(requestDTO.getTemperature());
        healthCheck.setConsultationAppointment(requestDTO.isConsultationAppointment());
        healthCheck.setNotes(requestDTO.getNotes());
        healthCheck.setParentConfirmation(requestDTO.isParentConfirmation());
        healthCheck.setCampaign(campaign);
        healthCheck.setStudent(student);
//        healthCheck = maptoEntityCheck(requestDTO);
        // Cập nhật các trường khác nếu cần

        healthCheckRepository.save(healthCheck);
        return mapToHealthCheckResponseDTO(healthCheck);
    }

    @Override
    public List<HealthCheckResponseDTO> getHealthCheckResults(Integer campaignId) {
        return healthCheckRepository.findByCampaignId(campaignId).stream()
                .map(this::mapToHealthCheckResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<HealthCheckResponseDTO> getAllHealthCheckResults() {
        return healthCheckRepository.findAll().stream()
                .map(this::mapToHealthCheckResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<HealthCheckResponseDTO> getResultByStudentId(Integer studentId) {
        List<HealthCheck> healthChecks = healthCheckRepository.findByStudentId(studentId);
        if (healthChecks.isEmpty()) {
            throw new RuntimeException("No health check results found for student with ID: " + studentId);
        }
        return healthChecks.stream().map(this::mapToHealthCheckResponseDTO).collect(Collectors.toList());
    }

    @Override
    public List<HealthCheckResponseDTO> getResultWithFilterDate(LocalDate startDate, LocalDate endDate,boolean consultationAppointment) {
        return healthCheckRepository.findResultWithDate( startDate, endDate , consultationAppointment).stream().map(this::mapToHealthCheckResponseDTO).collect(Collectors.toList());
    }

    @Override
    public List<HealthCampaignResponseDTO> getCampaignStatus(int studentId, boolean parentConfirmation) {
        List<HealthCheckCampaign> campaign = healthCheckCampaignRepository.findCampaignsByStudentIdAndParentConfirmation(studentId,parentConfirmation);
        if (campaign.isEmpty()) {
            throw new RuntimeException("No health campaigns found for student with ID: " + studentId + " and parent confirmation: " + parentConfirmation);
        }
        return campaign.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }
}

