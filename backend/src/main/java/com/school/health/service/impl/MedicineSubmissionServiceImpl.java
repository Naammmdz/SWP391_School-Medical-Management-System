package com.school.health.service.impl;

import com.school.health.dto.request.MedicineLogRequest;
import com.school.health.dto.request.MedicineSubmissionRequest;
import com.school.health.dto.request.StatusUpdateRequest;
import com.school.health.dto.response.*;
import com.school.health.entity.*;
import com.school.health.enums.MedicineSubmissionStatus;
import com.school.health.exception.AccessDeniedException;
import com.school.health.exception.BadRequestException;
import com.school.health.exception.ResourceNotFoundException;
import com.school.health.repository.MedicineLogRepository;
import com.school.health.repository.MedicineSubmissionRepository;
import com.school.health.repository.StudentRepository;
import com.school.health.repository.UserRepository;
import com.school.health.service.MedicineSubmissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MedicineSubmissionServiceImpl implements MedicineSubmissionService {

    @Autowired
    private MedicineSubmissionRepository medicineSubmissionRepository;

    @Autowired
    private MedicineLogRepository medicineLogRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private UserRepository userRepository;


    // ===== PARENT OPERATIONS =====
    @Override
    public MedicineSubmissionResponse createMedicineSubmission(MedicineSubmissionRequest request, Integer parentId) {
        //Validate the request: ngay ket thuc >= ngay bat dau
        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new BadRequestException("Ngày kết thúc phải sau hoặc bằng ngày bắt đầu");
        }
        //Validate: học sinh và phụ huynh có tồn tại
        Optional<Student> student = Optional.ofNullable(studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Học sinh không tồn tại")));
        Optional<User> parent = Optional.ofNullable(userRepository.findById(parentId)
                .orElseThrow(() -> new ResourceNotFoundException("Phụ huynh không tồn tại")));

        //Create a new MedicineSubmission entity
        MedicineSubmission medicineSubmission = new MedicineSubmission();
        medicineSubmission.setStudent(student.get());
        medicineSubmission.setParent(parent.get());
        medicineSubmission.setInstruction(request.getInstruction());
        medicineSubmission.setDuration(request.getDuration());
        medicineSubmission.setStartDate(request.getStartDate());
        medicineSubmission.setEndDate(request.getEndDate());
        medicineSubmission.setNotes(request.getNotes());
        medicineSubmission.setSubmissionStatus(MedicineSubmissionStatus.PENDING);

        //Map the medicine details from request to entity
        List<MedicineDetail> medicineDetails = request.getMedicineDetails().stream()
                .map(detail -> {
                    MedicineDetail medicineDetail = new MedicineDetail();
                    medicineDetail.setMedicineName(detail.getMedicineName());
                    medicineDetail.setMedicineDosage(detail.getMedicineDosage());
                    medicineDetail.setMedicineSubmission(medicineSubmission);
                    return medicineDetail;
                }).collect(Collectors.toList());
        medicineSubmission.setMedicineDetails(medicineDetails);

        //Save the MedicineSubmission entity
        medicineSubmissionRepository.save(medicineSubmission);
        //Return the saved submission
        return toResponse(medicineSubmission);
    }

    private MedicineSubmissionResponse toResponse(MedicineSubmission submission) {
        MedicineSubmissionResponse resp = new MedicineSubmissionResponse();
        resp.setId(submission.getMedicineSubmissionId());
        resp.setStudentId(submission.getStudent().getStudentId());
        resp.setStudentName(submission.getStudent().getFullName());
        resp.setParentId(submission.getParent().getUserId());
        resp.setParentName(submission.getParent().getFullName());
        resp.setInstruction(submission.getInstruction());
        resp.setDuration(submission.getDuration());
        resp.setStartDate(submission.getStartDate());
        resp.setEndDate(submission.getEndDate());
        resp.setNotes(submission.getNotes());
        resp.setSubmissionStatus(submission.getSubmissionStatus().name());
        if (submission.getApprovedBy() != null) {
            resp.setApprovedBy(submission.getApprovedBy().getUserId());
            resp.setApprovedByName(submission.getApprovedBy().getFullName());
        }
        resp.setApprovedAt(submission.getApprovedAt());
        resp.setMedicineDetails(
                submission.getMedicineDetails() != null ?
                        submission.getMedicineDetails().stream().map(detail -> {
                            MedicineDetailResponse d = new MedicineDetailResponse();
                            d.setId(detail.getId());
                            d.setMedicineName(detail.getMedicineName());
                            d.setMedicineDosage(detail.getMedicineDosage());
                            return d;
                        }).collect(Collectors.toList())
                        : Collections.emptyList()
        );
        return resp;
    }


    @Override
    public List<MedicineSubmissionResponse> getAllByParent(Integer parentId, Integer studentId, String status) {
        List<MedicineSubmission> submissions;

        MedicineSubmissionStatus statusEnum = null;
        if (status != null) {
            try {
                statusEnum = MedicineSubmissionStatus.valueOf(status);
            } catch (IllegalArgumentException e) {
                throw new BadRequestException("Invalid status: " + status);
            }
        }

        if (studentId != null && status != null) {
            submissions = medicineSubmissionRepository.findByParent_UserIdAndStudent_StudentIdAndSubmissionStatus(parentId, studentId, statusEnum);
        } else if (studentId != null) {
            submissions = medicineSubmissionRepository.findByParent_UserIdAndStudent_StudentId(parentId, studentId);
        } else if (status != null) {
            submissions = medicineSubmissionRepository.findByParent_UserIdAndSubmissionStatus(parentId, statusEnum);
        } else {
            submissions = medicineSubmissionRepository.findByParent_UserId(parentId);
        }

        return submissions.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<StudentSummaryResponse> getChildrenByParent(Integer parentId) {
        List<Student> students = studentRepository.findByParentUserId(parentId);
        return students.stream().map(student -> {
            StudentSummaryResponse summary = new StudentSummaryResponse();
            summary.setStudentId(student.getStudentId());
            summary.setFullName(student.getFullName());
            summary.setClassName(student.getClassName());
            summary.setPendingSubmissions(medicineSubmissionRepository.countByStudent_StudentIdAndSubmissionStatus(student.getStudentId(), MedicineSubmissionStatus.PENDING));
            summary.setApprovedSubmissions(medicineSubmissionRepository.countByStudent_StudentIdAndSubmissionStatus(student.getStudentId(), MedicineSubmissionStatus.APPROVED));

            return summary;
        }).collect(Collectors.toList());
    }

    @Override
    public void deleteByParent(Integer id, Integer parentId) {
        MedicineSubmission submission = medicineSubmissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn thuốc: " + id));

        if (!submission.getParent().getUserId().equals(parentId)) {
            throw new AccessDeniedException("Bạn chỉ có thể xóa đơn thuốc của chính mình");
        }

        if (submission.getSubmissionStatus() != MedicineSubmissionStatus.PENDING) {
            throw new BadRequestException("Chỉ có thể xóa các đơn thuốc đang chờ duyệt");
        }

        medicineSubmissionRepository.deleteById(id);
    }

    // ===== ADMIN OPERATIONS =====
    @Override
    public List<MedicineSubmissionResponse> getAllForAdmin(Integer studentId, Integer parentId, String status) {
        List<MedicineSubmission> submissions;

        MedicineSubmissionStatus statusEnum = null;
        if (status != null) {
            try {
                statusEnum = MedicineSubmissionStatus.valueOf(status);
            } catch (IllegalArgumentException e) {
                throw new BadRequestException("Invalid status: " + status);
            }
        }

        if (studentId != null && parentId != null && status != null) {
            submissions = medicineSubmissionRepository.findByParent_UserIdAndStudent_StudentIdAndSubmissionStatus(parentId, studentId, statusEnum);
        } else if (studentId != null && parentId != null) {
            submissions = medicineSubmissionRepository.findByParent_UserIdAndStudent_StudentId(parentId, studentId);
        } else if (studentId != null && status != null) {
            submissions = medicineSubmissionRepository.findByStudent_StudentIdAndSubmissionStatus(studentId, statusEnum);
        } else if (parentId != null && status != null) {
            submissions = medicineSubmissionRepository.findByParent_UserIdAndSubmissionStatus(parentId, statusEnum);
        } else if (studentId != null) {
            submissions = medicineSubmissionRepository.findByStudent_StudentId(studentId);
        } else if (parentId != null) {
            submissions = medicineSubmissionRepository.findByParent_UserId(parentId);
        } else if (status != null) {
            submissions = medicineSubmissionRepository.findBySubmissionStatus(statusEnum);
        } else {
            submissions = medicineSubmissionRepository.findAllOrderBySubmissionDateDesc();
        }

        return submissions.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public AdminDashboardResponse getAdminDashboard() {
        AdminDashboardResponse response = new AdminDashboardResponse();

        response.setTotalSubmissions(medicineSubmissionRepository.count());
        response.setPendingSubmissions(medicineSubmissionRepository.countBySubmissionStatus(MedicineSubmissionStatus.PENDING));
        response.setApprovedSubmissions(medicineSubmissionRepository.countBySubmissionStatus(MedicineSubmissionStatus.APPROVED));
        response.setRejectedSubmissions(medicineSubmissionRepository.countBySubmissionStatus(MedicineSubmissionStatus.REJECTED));

        LocalDate today = LocalDate.now();
        response.setTodaySubmissions(medicineSubmissionRepository.countBySubmissionDate(today));

        return response;
    }


    // ===== COMMON OPERATIONS =====
    @Override
    public MedicineSubmissionResponse getById(Integer id) {
        MedicineSubmission submission = medicineSubmissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Submission not found: " + id));

        return toResponse(submission);
    }


    @Override
    public MedicineSubmissionResponse updateStatus(Integer id, StatusUpdateRequest request) {
        return null;
    }

    @Override
    public void delete(Integer id) {

    }




    // ===== NURSE OPERATIONS =====
    @Override
    public List<MedicineSubmissionResponse> getAllForNurse(Integer studentId, Integer parentId, String status) {
        List<MedicineSubmission> submissions;
        MedicineSubmissionStatus statusEnum = null;
        if (status != null) {
            try {
                statusEnum = MedicineSubmissionStatus.valueOf(status);
            } catch (IllegalArgumentException e) {
                throw new BadRequestException("Invalid status: " + status);
            }
        }
        if (status == null) {
            // Mặc định xem PENDING trước
            submissions = medicineSubmissionRepository.findAllOrderByStatusAndDate();
        } else {
            submissions = medicineSubmissionRepository.findByStatusOrderByDate(statusEnum);
        }

        // Apply filters
        if (studentId != null) {
            submissions = submissions.stream()
                    .filter(s -> s.getStudent().getStudentId().equals(studentId))
                    .collect(Collectors.toList());
        }
        if (parentId != null) {
            submissions = submissions.stream()
                    .filter(s -> s.getParent().getUserId().equals(parentId))
                    .collect(Collectors.toList());
        }

        return submissions.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public HealthDashboardResponse getHealthDashboard() {
        HealthDashboardResponse response = new HealthDashboardResponse();

        LocalDate today = LocalDate.now();
        response.setPendingApproval(medicineSubmissionRepository.countBySubmissionStatus(MedicineSubmissionStatus.PENDING));
        response.setTodayMedicineLogs(medicineSubmissionRepository.countByGivenAt(today));
        response.setActiveSubmissions(medicineSubmissionRepository.countActiveSubmissions(today));
        response.setExpiringSubmissions(medicineSubmissionRepository.countExpiringSubmissions(today.plusDays(3)));

        return response;
    }

    @Override
    public MedicineLogResponse markMedicineTaken(Integer submissionId, MedicineLogRequest request) {
        MedicineSubmission submission = medicineSubmissionRepository.findById(submissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Submission not found: " + submissionId));

        if (submission.getSubmissionStatus() != MedicineSubmissionStatus.APPROVED) {
            throw new BadRequestException("Only approved submissions can be logged");
        }

        User givenBy = userRepository.findById(request.getGivenByUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + request.getGivenByUserId()));

        MedicineLog log = new MedicineLog();
        log.setMedicineSubmission(submission);
        log.setGivenBy(givenBy);
        log.setGivenAt(request.getGivenAt());
        log.setNotes(request.getNotes());

        medicineLogRepository.save(log);

        return toLogResponse(log);
    }

    private MedicineLogResponse toLogResponse(MedicineLog log) {
        MedicineLogResponse response = new MedicineLogResponse();
        response.setId(log.getMedicineLogId());
        response.setSubmissionId(log.getMedicineSubmission().getMedicineSubmissionId());
        response.setGivenByUserId(log.getGivenBy().getUserId());
        response.setGivenByName(log.getGivenBy().getFullName());
        response.setGivenAt(log.getGivenAt());
        response.setNotes(log.getNotes());
        return response;
    }
}
