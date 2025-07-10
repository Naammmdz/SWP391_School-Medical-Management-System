package com.school.health.service.impl;

import com.school.health.dto.request.VaccinationCampaignRequestDTO;
import com.school.health.dto.request.VaccinationRequestDTO;

import com.school.health.dto.response.*;

import com.school.health.entity.*;


import com.school.health.enums.Status;

import com.school.health.event.noti.VaccinationCampaignApprovedEvent;
import com.school.health.event.noti.VaccinationCampaignCreatedEvent;

import com.school.health.repository.*;
import com.school.health.service.VaccinationCampaignService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.text.Normalizer;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VaccinationCampaignServiceImpl implements VaccinationCampaignService {
    private final VaccinationCampaignRepository vaccinationCampaignRepository;
    private final VaccinationRepository vaccinationRepository;
    private final StudentRepository studentRepository;
    private final NotificationServiceImpl notificationService;
    private final UserRepository userRepository;

    @Override
    public VaccinationCampaignResponseDTO createVaccinationCampaign(VaccinationCampaignRequestDTO vaccinationCampaignRequestDTO, int createdBy) {
        VaccinationCampaign campaign = mapToEntity(vaccinationCampaignRequestDTO);
        campaign.setCreatedBy(createdBy);
        VaccinationCampaign savedCampaign = vaccinationCampaignRepository.save(campaign);
        notificationService.createNotification(userRepository.findPrincipal().getUserId(), "[Yêu cầu phê duyệt] Chiến dịch tiêm chủng Vaccine: " + campaign.getCampaignName(), "Kính gửi Thầy/Cô Hiệu trưởng,\n" +
                "\n" +
                "Hiện tại có một chiến dịch kiểm tra sức khỏe học đường đang chờ phê duyệt với các thông tin như sau:\n" +
                "\n" +
                "Tên chiến dịch: " + campaign.getCampaignName() +
                "\n" +
                "Đơn vị tổ chức: " + campaign.getOrganizer() +
                "\n" +
                "Đối tượng mục tiêu: " + campaign.getTargetGroup() +
                "\n" +
                "Thời gian dự kiến: " + campaign.getScheduledDate() +
                "\n" +
                "Địa điểm: " + campaign.getAddress() +
                "\n" +
                "Mô tả: " + campaign.getDescription() +
                "\n" +
                "Thầy/Cô vui lòng xem xét và thực hiện phê duyệt hoặc từ chối chiến dịch này trên hệ thống trước thời gian diễn ra.\n" +
                "\n" +
                "Trân trọng,\n" +
                "Hệ thống Y tế học đường");
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
    public VaccinationCampaignResponseDTO approveVaccinationCampaign(Integer campaignId, int approvedBy, Status status, String rejectionReason) {
        VaccinationCampaign campaign = vaccinationCampaignRepository.findById(campaignId).orElseThrow(() -> new RuntimeException("Campaign not found id :" + campaignId));

        campaign.setApprovedBy(approvedBy);
        campaign.setStatus(status);
        if( status == Status.CANCELLED) {
            campaign.setRejectionReason(rejectionReason);
        } else {
            campaign.setRejectionReason(null); // Clear rejection reason if approved
        }

        VaccinationCampaign approvedCampaign = vaccinationCampaignRepository.save(campaign);
        // Gửi đến yta/ admin đã tạo chiến dịch về tình trạng chiến dich
        notificationService.createNotification(campaign.getCreatedBy(), "Chiến dịch: " + campaign.getCampaignName() + " đã được phê duyệt", "Chiến dịch: " + campaign.getCampaignName() + " đã được phê duyệt bởi " + userRepository.findByUserId(approvedBy).orElseThrow().getFullName() + " vui lòng kiểm tra!");
        //Gửi noti đến người dùng có con trong target group
        String[] targetGroup = campaign.getTargetGroup().split(",");
        for (String group : targetGroup) {
            group = group.trim();
            if (group.length() == 1) {
                List<Student> studentList = studentRepository.findByGrade(group);
                for (Student student : studentList) {
                    notificationService.createNotification(student.getParent().getUserId(), "[THÔNG BÁO] Triển khai chiến dịch tiêm chủng tại trường!", "Kính gửi Quý Phụ huynh,\n" +
                            "\n" +
                            "Nhằm tăng cường sức khỏe và phòng ngừa dịch bệnh cho học sinh, nhà trường phối hợp với Trung tâm Y tế địa phương tổ chức chiến dịch tiêm chủng định kỳ cho các em học sinh.\n" +
                            "\n" +
                            "Thông tin chi tiết như sau:\n" +
                            "\n" +
                            "Thời gian: " + campaign.getScheduledDate() + "\n" +
                            "\n" +
                            "Địa điểm: " + campaign.getAddress() + "\n" +
                            "\n" +
                            "Một số thông tin khác: " + campaign.getDescription() + "\n" +
                            "\n" +
                            "Lưu ý:\n" +
                            "\n" +
                            "Phụ huynh vui lòng kiểm tra và xác nhận đồng ý tiêm chủng trước " + campaign.getScheduledDate().minusDays(2) + "\n" +
                            "\n" +
                            "Đảm bảo học sinh ăn sáng đầy đủ trước khi tiêm.\n" +
                            "\n" +
                            "Học sinh cần mang theo sổ y bạ (nếu có).\n" +
                            "\n" +
                            "Sự phối hợp của Quý Phụ huynh sẽ góp phần quan trọng vào thành công của chương trình và sức khỏe của các em học sinh.\n" +
                            "\n" +
                            "Trân trọng cảm ơn!\n" +
                            "\n" +
                            "Ban Giám hiệu");
                }
            } else if (group.length() == 2) {
                List<Student> studentList = studentRepository.findByClassName(group);
                for (Student student : studentList) {
                    notificationService.createNotification(student.getParent().getUserId(), "[THÔNG BÁO] Triển khai chiến dịch tiêm chủng tại trường!", "Kính gửi Quý Phụ huynh,\n" +
                            "\n" +
                            "Nhằm tăng cường sức khỏe và phòng ngừa dịch bệnh cho học sinh, nhà trường phối hợp với Trung tâm Y tế địa phương tổ chức chiến dịch tiêm chủng định kỳ cho các em học sinh.\n" +
                            "\n" +
                            "Thông tin chi tiết như sau:\n" +
                            "\n" +
                            "Thời gian: " + campaign.getScheduledDate() + "\n" +
                            "\n" +
                            "Địa điểm: " + campaign.getAddress() + "\n" +
                            "\n" +
                            "Một số thông tin khác: " + campaign.getDescription() + "\n" +
                            "\n" +
                            "Lưu ý:\n" +
                            "\n" +
                            "Phụ huynh vui lòng kiểm tra và xác nhận đồng ý tiêm chủng trước " + campaign.getScheduledDate().minusDays(2) + "\n" +
                            "\n" +
                            "Đảm bảo học sinh ăn sáng đầy đủ trước khi tiêm.\n" +
                            "\n" +
                            "Học sinh cần mang theo sổ y bạ (nếu có).\n" +
                            "\n" +
                            "Sự phối hợp của Quý Phụ huynh sẽ góp phần quan trọng vào thành công của chương trình và sức khỏe của các em học sinh.\n" +
                            "\n" +
                            "Trân trọng cảm ơn!\n" +
                            "\n" +
                            "Ban Giám hiệu");
                }
            }
        }
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
    public List<VaccineV2CampaignResponseDTO> getApprovedCampaigns(int parentId) {

        // Lấy danh sách học sinh thuộc phụ huynh
        List<Student> students = studentRepository.findByParentId(parentId);

        // Lấy danh sách health check theo học sinh
        List<Vaccination> healthChecks = vaccinationRepository.findByStudentIn(students);

        Map<Integer, List<Vaccination>> checksByCampaign = healthChecks.stream()
                .collect(Collectors.groupingBy(h -> h.getCampaign().getCampaignId()));

        // Lấy campaign đã được duyệt
        List<VaccinationCampaign> approvedCampaigns = vaccinationCampaignRepository.findByStatus(Status.APPROVED);

        return approvedCampaigns.stream().map(campaign -> {
            List<Vaccination> checks = checksByCampaign.getOrDefault(campaign.getCampaignId(), new ArrayList<>());

            Boolean confirmStatus;
            if (checks.isEmpty()) {
                confirmStatus = null; // No checks found for this campaign
            } else if (checks.stream().allMatch(Vaccination::isParentConfirmation)) {
                confirmStatus = true;
            } else if (checks.stream().noneMatch(Vaccination::isParentConfirmation)) {
                confirmStatus = false;
            } else {
                confirmStatus = null;
            }

            return VaccineV2CampaignResponseDTO.builder()
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
                    .isParentConfirm(confirmStatus)
                    .build();
        }).collect(Collectors.toList());
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
        if (vaccine.isEmpty()) {
            throw new RuntimeException("Vaccination not found : " + studentId);
        }
        return vaccine.stream().map(this::mapToResponseDTO).collect(Collectors.toList());
    }

    @Override
    public List<VaccinationResponseDTO> getResultWithFilterDate(LocalDate startDate, LocalDate endDate) {
        return vaccinationRepository.findResultWithDate(startDate, endDate).stream().map(this::mapToResponseDTO).collect(Collectors.toList());
    }

    @Override
    public List<VaccinationCampaignResponseDTO> getCampaignStatus(int studentId, boolean parentConfirmation) {
        List<VaccinationCampaign> campaign = vaccinationCampaignRepository.findCampaignsByStudentIdAndParentConfirmation(studentId, parentConfirmation);
        if (campaign.isEmpty()) {
            throw new RuntimeException("No health campaigns found for student with ID: " + studentId + " and parent confirmation: " + parentConfirmation);
        }
        return campaign.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }


    @Override
    public List<VaccinationResponseResultDTO> filterVaccinationCampaigns(String className, String campaignName, String studentName, Boolean parentConfirmation, LocalDate startDate, LocalDate endDate) {
        Specification<Vaccination> spec = Specification.where(null);

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
        if (Boolean.TRUE.equals(parentConfirmation)) {
            spec = spec.and((root, query, cb) -> cb.isTrue(root.get("parentConfirmation")));
        } else if (Boolean.FALSE.equals(parentConfirmation)) {
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


        return vaccinationRepository.findAll(spec).stream()
                .map(vac ->
                        VaccinationResponseResultDTO.builder()
                                .vaccinationId(vac.getVaccinationId())
                                .date(vac.getDate())
                                .adverseReaction(vac.getAdverseReaction())
                                .doseNumber(vac.getDoseNumber())
                                .notes(vac.getNotes())
                                .parentConfirmation(vac.isParentConfirmation())
                                .result(vac.getResult())
                                .studentId(vac.getStudent().getStudentId())
                                .isPreviousDose(vac.isPreviousDose())
                                .vaccineName(vac.getVaccineName())
                                .campaignId(vac.getCampaign().getCampaignId())
                                .campaignName(vac.getCampaign().getCampaignName())
                                .scheduledDate(vac.getCampaign().getScheduledDate())
                                .studentName(vac.getStudent().getFullName())
                                .className(vac.getStudent().getClassName())
                                .build()
                )
                .collect(Collectors.toList());
    }

    @Override
    public List<VaccinationResponseResultDTO> getAllVaccinationResultsWithParentConfirmationTrue() {
        return vaccinationRepository.findAll().stream()
                .map(vac ->
                        VaccinationResponseResultDTO.builder()
                                .vaccinationId(vac.getVaccinationId())
                                .date(vac.getDate())
                                .adverseReaction(vac.getAdverseReaction())
                                .doseNumber(vac.getDoseNumber())
                                .notes(vac.getNotes())
                                .parentConfirmation(vac.isParentConfirmation())
                                .result(vac.getResult())
                                .studentId(vac.getStudent().getStudentId())
                                .isPreviousDose(vac.isPreviousDose())
                                .vaccineName(vac.getVaccineName())
                                .campaignId(vac.getCampaign().getCampaignId())
                                .campaignName(vac.getCampaign().getCampaignName())
                                .scheduledDate(vac.getCampaign().getScheduledDate())
                                .build()
                ).filter(parent -> parent.isParentConfirmation() == true)
                .collect(Collectors.toList());
    }

    public String removeAccent(String input) {
        if (input == null) return null;
        String normalized = Normalizer.normalize(input, Normalizer.Form.NFD);
        return normalized.replaceAll("\\p{M}", "");
    }

    @Override
    public List<StudentResponseDTO> getAllStudentsInCampaign(Integer campaignId) {
        VaccinationCampaign campaign = vaccinationCampaignRepository.findById(campaignId)
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
    public List<VaccinationResponseResultDTO> getStudentsWithVaccinationStatus(Integer campaignId) {
        VaccinationCampaign campaign = vaccinationCampaignRepository.findById(campaignId)
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
        List<Vaccination> existingVaccinations = vaccinationRepository.findByCampaignId(campaignId);

        // Create result list
        List<VaccinationResponseResultDTO> results = new ArrayList<>();

        for (Student student : eligibleStudents) {
            // Find existing vaccination record for this student
            Vaccination vaccination = existingVaccinations.stream()
                    .filter(v -> v.getStudent().getStudentId().equals(student.getStudentId()))
                    .findFirst()
                    .orElse(null);

            VaccinationResponseResultDTO dto = VaccinationResponseResultDTO.builder()
                    .studentId(student.getStudentId())
                    .studentName(student.getFullName())
                    .className(student.getClassName())
                    .campaignId(campaign.getCampaignId())
                    .campaignName(campaign.getCampaignName())
                    .scheduledDate(campaign.getScheduledDate())
                    .build();

            if (vaccination != null) {
                // Student has vaccination record
                dto.setVaccinationId(vaccination.getVaccinationId());
                dto.setDate(vaccination.getDate());
                dto.setDoseNumber(vaccination.getDoseNumber());
                dto.setAdverseReaction(vaccination.getAdverseReaction());
                dto.setNotes(vaccination.getNotes());
                dto.setParentConfirmation(vaccination.isParentConfirmation());
                dto.setResult(vaccination.getResult());
                dto.setVaccineName(vaccination.getVaccineName());
                dto.setPreviousDose(vaccination.isPreviousDose());
            } else {
                // Student has no vaccination record yet
                dto.setVaccinationId(0);
                dto.setParentConfirmation(false);
                dto.setResult("PENDING");
            }

            results.add(dto);
        }

        return results;
    }
}


