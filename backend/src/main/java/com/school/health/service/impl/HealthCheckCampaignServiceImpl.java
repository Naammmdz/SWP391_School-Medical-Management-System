package com.school.health.service.impl;

import com.school.health.dto.request.HealthCampaignRequestDTO;
import com.school.health.dto.request.HealthCheckRequestDTO;
import com.school.health.dto.response.*;

import com.school.health.entity.*;

import com.school.health.enums.Status;
import com.school.health.event.noti.HealthCheckCampaignApprovedEvent;
import com.school.health.event.noti.HealthCheckCampaignCreatedEvent;
import com.school.health.repository.HealthCheckCampaignRepository;
import com.school.health.repository.HealthCheckRepository;
import com.school.health.repository.StudentRepository;
import com.school.health.service.HealthCheckCampaignService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static com.school.health.enums.Status.APPROVED;

@Service
@RequiredArgsConstructor
public class HealthCheckCampaignServiceImpl implements HealthCheckCampaignService {
    private final ApplicationEventPublisher eventPublisher;
    private final HealthCheckCampaignRepository healthCheckCampaignRepository;
    private final HealthCheckRepository healthCheckRepository;
    private final StudentRepository studentRepository;

    @Override
    public HealthCampaignResponseDTO createCampaign(HealthCampaignRequestDTO healthCampaignRequestDTO, int createdBy) {
        HealthCheckCampaign campaign = mapToEntity(healthCampaignRequestDTO);
        campaign.setCreatedBy(createdBy);
        HealthCheckCampaign savedCampaign = healthCheckCampaignRepository.save(campaign);

        eventPublisher.publishEvent(new HealthCheckCampaignCreatedEvent(savedCampaign));

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
    public HealthCampaignResponseDTO approveCampaign(int campaignId, int approvedBy, Status status, String rejectionReason) {
        HealthCheckCampaign existingCampaign = healthCheckCampaignRepository.findById(campaignId).orElseThrow(() -> new RuntimeException("Campaign not found with ID: " + campaignId));

        existingCampaign.setApprovedBy(approvedBy);
        existingCampaign.setStatus(status); // Set status thành approved
        // Khi phê duyệt, không cần thiết phải set rejectionReason
        // Khi từ chối chiến dịch, sẽ set rejectionReason
        if( status == Status.CANCELLED) {
            existingCampaign.setRejectionReason(rejectionReason);
        } else {
            existingCampaign.setRejectionReason(null); // Xóa lý do từ chối nếu không phải là trạng thái REJECTED
        }

        HealthCheckCampaign updatedCampaign = healthCheckCampaignRepository.save(existingCampaign);
        // Gửi đến yta/ admin đã tạo chiến dịch về tình trạng chiến dich
        eventPublisher.publishEvent(new HealthCheckCampaignApprovedEvent(updatedCampaign));
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
    public List<HealthV2CampaignResponseDTO> getApprovedCampaigns(int parentId) {

        // Lấy danh sách học sinh thuộc phụ huynh
        List<Student> students = studentRepository.findByParentId(parentId);

        // Lấy danh sách health check theo học sinh
        List<HealthCheck> healthChecks = healthCheckRepository.findByStudentIn(students);

        Map<Integer, List<HealthCheck>> checksByCampaign = healthChecks.stream()
                .collect(Collectors.groupingBy(h -> h.getCampaign().getCampaignId()));

        // Lấy campaign đã được duyệt
        List<HealthCheckCampaign> approvedCampaigns = healthCheckCampaignRepository.findByStatus(Status.APPROVED);

        return approvedCampaigns.stream().map(campaign -> {
            List<HealthCheck> checks = checksByCampaign.getOrDefault(campaign.getCampaignId(), new ArrayList<>());

            Boolean confirmStatus;
            if(checks.isEmpty()) {
                confirmStatus = null; // Trường hợp không có kết quả kiểm tra nào
            } else
            if (checks.stream().allMatch(HealthCheck::isParentConfirmation)) {
                confirmStatus = true;
            } else if (checks.stream().noneMatch(HealthCheck::isParentConfirmation)) {
                confirmStatus = false;
            } else {
                confirmStatus = null; // Trường hợp có cả xác nhận và không xác nhận từ phụ huynh
            }

            return HealthV2CampaignResponseDTO.builder()
                    .campaignId(campaign.getCampaignId())
                    .campaignName(campaign.getCampaignName())
                    .targetGroup(campaign.getTargetGroup())
                    .type(campaign.getType())
                    .address(campaign.getAddress())
                    .organizer(campaign.getOrganizer())
                    .description(campaign.getDescription())
                    .scheduledDate(campaign.getScheduledDate())
                    .createdBy(campaign.getCreatedBy())
                    .approvedBy(campaign.getApprovedBy())
                    .approvedAt(campaign.getApprovedAt())
                    .status(campaign.getStatus())
                    .createdAt(campaign.getCreatedAt())
                    .parentConfirmStatus(confirmStatus)
                    .build();
        }).collect(Collectors.toList());
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
        List<HealthCheckCampaign> health = healthCheckCampaignRepository.findCampaignsByStudentId(studentId, APPROVED);
        if (health.isEmpty()) {
            throw new RuntimeException("No health campaigns found for campaign is not APPROVED or not found student with ID: " + studentId);
        }
        return health;
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
    public HealthCheckResponseDTO updateStudentHealthCampaign(Integer healthcheckId, HealthCheckRequestDTO requestDTO) {
        HealthCheck healthCheck = healthCheckRepository.findById(healthcheckId).orElseThrow(() -> new RuntimeException("Health check not found with ID: " + healthcheckId));
        HealthCheckCampaign campaign = healthCheckCampaignRepository.findById(requestDTO.getCampaignId()).orElseThrow(() -> new RuntimeException("Campaign not found with ID: " + requestDTO.getCampaignId()));
        Student student = studentRepository.findById(requestDTO.getStudentId()).orElseThrow(() -> new RuntimeException("Student not found with ID: " + requestDTO.getStudentId()));
        if (healthCheck.isParentConfirmation() == false) {
            throw new RuntimeException("Parent confirmation is required to update health check results.");
        }
        // date phải bằng hoặc lớn hơn từ scheduled date của campaign
        if (requestDTO.getDate() == null || requestDTO.getDate().isBefore(campaign.getScheduledDate())) {
            throw new RuntimeException("Ngày cập nhật không hợp lệ. Ngày khám phải bằng hoặc lớn hơn ngày đã lên lịch của chiến dịch.");
        }
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
        // healthCheck = maptoEntityCheck(requestDTO);
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
    public List<HealthCheckResponseDTO> getResultWithFilterDate(LocalDate startDate, LocalDate endDate, boolean consultationAppointment) {
        return healthCheckRepository.findResultWithDate(startDate, endDate, consultationAppointment).stream().map(this::mapToHealthCheckResponseDTO).collect(Collectors.toList());
    }

    @Override
    public List<HealthCampaignResponseDTO> getCampaignStatus(int studentId, boolean parentConfirmation) {
        List<HealthCheckCampaign> campaign = healthCheckCampaignRepository.findCampaignsByStudentIdAndParentConfirmation(studentId, parentConfirmation);
        if (campaign.isEmpty()) {
            throw new RuntimeException("No health campaigns found for student with ID: " + studentId + " and parent confirmation: " + parentConfirmation);
        }
        return campaign.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }


    @Override
    public List<HealthCampaignIsAcceptDTO> getCampaignsIsAcceptOrReject(Integer studentId) {
        List<HealthCheck> healthChecks = healthCheckRepository.findByStudentId(studentId);
        if (healthChecks.isEmpty()) {
            throw new RuntimeException("No health checks found for student with ID: " + studentId);
        }
        return healthChecks.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private HealthCampaignIsAcceptDTO convertToDto(HealthCheck healthCheck) {
        HealthCheckCampaign campaign = healthCheck.getCampaign();
        HealthCampaignIsAcceptDTO dto = new HealthCampaignIsAcceptDTO();
        dto.setCampaignId(campaign.getCampaignId());
        dto.setCampaignName(campaign.getCampaignName());
        dto.setScheduledDate(campaign.getScheduledDate());
        dto.setStatus(campaign.getStatus());
        dto.setAcceptOrNot(healthCheck.isParentConfirmation());
        return dto;
    }

    @Override
    public List<HealthCheckResponseResultDTO> filterHealthCheckCampaigns(String className, String campaignName, String studentName, Boolean isParentConfirmation, LocalDate startDate, LocalDate endDate) {
        Specification<HealthCheck> spec = Specification.where(null);

        if (className != null && !className.isBlank()) {
            spec = spec.and((root, query, cb) ->
                    cb.like(root.get("student").get("className"), "%" + className + "%"));
        }

        if (campaignName != null && !campaignName.isBlank()) {
            spec = spec.and((root, query, cb) ->
                    cb.like(root.get("campaign").get("campaignName"), "%" + campaignName + "%"));
        }

        if (studentName != null && !studentName.isBlank()) {
            spec = spec.and((root, query, cb) ->
                    cb.like(cb.lower(root.get("student").get("fullName")), "%" + studentName.toLowerCase() + "%"));
        }

        // Kiểm tra isParentConfirmation và áp dụng điều kiện tương ứng
        // nếu isParentConfirmation là true, thì lọc các kết quả có parentConfirmation là true
        // nếu isParentConfirmation là false, thì lọc các kết quả có parentConfirmation là false
        // nếu isParentConfirmation là null, thì in ra hết
        if (Boolean.TRUE.equals(isParentConfirmation)) {
            spec = spec.and((root, query, cb) -> cb.isTrue(root.get("parentConfirmation")));
        } else if (Boolean.FALSE.equals(isParentConfirmation)) {
            spec = spec.and((root, query, cb) -> cb.isFalse(root.get("parentConfirmation")));
        }
        if (startDate != null && endDate != null) {
            spec = spec.and((root, query, cb) ->
                    cb.between(root.get("date"), startDate, endDate));
        } else if (startDate != null) {
            spec = spec.and((root, query, cb) ->
                    cb.greaterThanOrEqualTo(root.get("date"), startDate));
        } else if (endDate != null) {
            spec = spec.and((root, query, cb) ->
                    cb.lessThanOrEqualTo(root.get("date"), endDate));
        }


        return healthCheckRepository.findAll(spec).stream()
                .map(heal -> HealthCheckResponseResultDTO.builder()
                        .healthCheckId(heal.getCheckId())
                        .date(heal.getDate())
                        .height(heal.getHeight())
                        .weight(heal.getWeight())
                        .eyesightLeft(heal.getEyesightLeft())
                        .eyesightRight(heal.getEyesightRight())
                        .bloodPressure(heal.getBloodPressure())
                        .hearingLeft(heal.getHearingLeft())
                        .hearingRight(heal.getHearingRight())
                        .temperature(heal.getTemperature())
                        .consultationAppointment(heal.isConsultationAppointment())
                        .notes(heal.getNotes())
                        .parentConfirmation(heal.isParentConfirmation())
                        .studentId(heal.getStudent().getStudentId())
                        .campaignId(heal.getCampaign().getCampaignId())
                        .campaignName(heal.getCampaign().getCampaignName())
                        .scheduledDate(heal.getCampaign().getScheduledDate())
                        .studentName(heal.getStudent().getFullName())
                        .className(heal.getStudent().getClassName())
                        .build())
                .collect(Collectors.toList());
    }


    @Override
    public List<HealthCheckResponseDTO> getAllHealthCheckResultsWithParentConfirmationTrue() {
        return healthCheckRepository.findAll().stream()
                .map(this::mapToHealthCheckResponseDTO)
                .filter(healthCheckResponseDTO -> healthCheckResponseDTO.isParentConfirmation() == true)
                .collect(Collectors.toList());
    }

    @Override
    public List<StudentResponseDTO> getAllStudentsInCampaign(Integer campaignId) {
        HealthCheckCampaign campaign = healthCheckCampaignRepository.findById(campaignId)
                .orElseThrow(() -> new RuntimeException("Campaign not found id: " + campaignId));

        List<Student> allStudents = new ArrayList<>();
        String[] targetGroups = campaign.getTargetGroup().split(",");

        for (String group : targetGroups) {
            group = group.trim();
            if (group.length() == 1) {
                // Single grade (e.g., "6" for grade 6)
                List<Student> gradeStudents = studentRepository.findByGrade(group);
                allStudents.addAll(gradeStudents);
            } else if (group.length() == 2) {
                // Specific class (e.g., "6A")
                List<Student> classStudents = studentRepository.findByClassName(group);
                allStudents.addAll(classStudents);
            }
        }

        // Remove duplicates and convert to DTO
        return allStudents.stream()
                .distinct()
                .filter(student -> student.isActive())
                .map(student -> {
                    StudentResponseDTO dto = new StudentResponseDTO();
                    dto.setStudentId(student.getStudentId());
                    dto.setFullName(student.getFullName());
                    dto.setDob(student.getDob());
                    dto.setGender(student.getGender());
                    dto.setClassName(student.getClassName());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<HealthCheckResponseResultDTO> getStudentsWithVaccinationStatus(Integer campaignId) {
        HealthCheckCampaign campaign = healthCheckCampaignRepository.findById(campaignId)
                .orElseThrow(() -> new RuntimeException("Campaign not found id: " + campaignId));

        // Get all eligible students
        List<Student> eligibleStudents = new ArrayList<>();
        String[] targetGroups = campaign.getTargetGroup().split(",");

        for (String group : targetGroups) {
            group = group.trim();
            if (group.length() == 1) {
                List<Student> gradeStudents = studentRepository.findByGrade(group);
                eligibleStudents.addAll(gradeStudents);
            } else if (group.length() == 2) {
                List<Student> classStudents = studentRepository.findByClassName(group);
                eligibleStudents.addAll(classStudents);
            }
        }

        // Remove duplicates
        eligibleStudents = eligibleStudents.stream()
                .distinct()
                .filter(Student::isActive)
                .collect(Collectors.toList());

        // Get existing vaccination records for this campaign
        List<HealthCheck> existingVaccinations = healthCheckRepository.findByCampaignId(campaignId);

        // Create result list
        List<HealthCheckResponseResultDTO> results = new ArrayList<>();

        for (Student student : eligibleStudents) {
            // Find existing vaccination record for this student
            HealthCheck vaccination = existingVaccinations.stream()
                    .filter(v -> v.getStudent().getStudentId().equals(student.getStudentId()))
                    .findFirst()
                    .orElse(null);

            HealthCheckResponseResultDTO dto = HealthCheckResponseResultDTO.builder()
                    .studentId(student.getStudentId())
                    .studentName(student.getFullName())
                    .className(student.getClassName())
                    .campaignId(campaign.getCampaignId())
                    .campaignName(campaign.getCampaignName())
                    .scheduledDate(campaign.getScheduledDate())
                    .build();

            if (vaccination != null) {
                // Student has vaccination record
                dto.setHealthCheckId(vaccination.getCheckId());
                dto.setDate(vaccination.getDate());
                dto.setHeight(vaccination.getHeight());
                dto.setWeight(vaccination.getWeight());
                dto.setNotes(vaccination.getNotes());
                dto.setParentConfirmation(vaccination.isParentConfirmation());
                dto.setEyesightLeft(vaccination.getEyesightLeft());
                dto.setEyesightRight(vaccination.getEyesightRight());
                dto.setHearingLeft(vaccination.getHearingLeft());
                dto.setHearingRight(vaccination.getHearingRight());
                dto.setBloodPressure(vaccination.getBloodPressure());
                dto.setTemperature(vaccination.getTemperature());
                dto.setConsultationAppointment(vaccination.isConsultationAppointment());
                dto.setStudentId(vaccination.getStudent().getStudentId());
                dto.setCampaignId(vaccination.getCampaign().getCampaignId());
                dto.setCampaignName(vaccination.getCampaign().getCampaignName());
                dto.setScheduledDate(vaccination.getCampaign().getScheduledDate());
                dto.setStudentName(vaccination.getStudent().getFullName());
                dto.setClassName(vaccination.getStudent().getClassName());

            } else {
                // Student has no vaccination record yet
                dto.setHealthCheckId(0);
                dto.setParentConfirmation(false);
            }

            results.add(dto);
        }

        return results;
    }


}

