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
import com.school.health.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;
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
    @Autowired
    private NotificationService notificationService;


    // ===== PARENT OPERATIONS =====
    @Override
    public MedicineSubmissionResponse createMedicineSubmission(MedicineSubmissionRequest request, MultipartFile image, Integer parentId) {
        //Validate the request: ngay ket thuc >= ngay bat dau
        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new BadRequestException("Ngày kết thúc phải sau hoặc bằng ngày bắt đầu");
        }
        //Validate: học sinh và phụ huynh có tồn tại
        Optional<Student> student = Optional.ofNullable(studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Học sinh không tồn tại")));
        Optional<User> parent = Optional.ofNullable(userRepository.findById(parentId)
                .orElseThrow(() -> new ResourceNotFoundException("Phụ huynh không tồn tại")));

        // Validate parent-child relationship
        if (!student.get().getParent().getUserId().equals(parentId)) {
            throw new AccessDeniedException("You are not allowed to submit medicine for this student.");
        }

        // Calculate duration based on start and end dates
        int duration = (int) ChronoUnit.DAYS.between(request.getStartDate(), request.getEndDate()) + 1;

        String encodedImage = null;;
        if (image != null) {
            try {
                // Check file size (max 5MB)
                if (image.getSize() > 5 * 1024 * 1024) {
                    throw new BadRequestException("Kích thước ảnh không được vượt quá 5MB");
                }

                // Check file type
                List<String> allowedTypes = Arrays.asList("image/jpeg", "image/png", "image/jpg");
                if (!allowedTypes.contains(image.getContentType())) {
                    throw new BadRequestException("Chỉ chấp nhận file ảnh (JPEG, PNG, JPG)");
                }

                // Convert to Base64
                byte[] imageBytes = image.getBytes();
                String contentType = image.getContentType();
                encodedImage = "data:" + contentType + ";base64," + Base64.getEncoder().encodeToString(imageBytes);

            } catch (IOException e) {
                throw new BadRequestException("Lỗi xử lý ảnh: " + e.getMessage());
            }
        }
        //Create a new MedicineSubmission entity
        MedicineSubmission medicineSubmission = new MedicineSubmission();
        medicineSubmission.setStudent(student.get());
        medicineSubmission.setParent(parent.get());
        medicineSubmission.setInstruction(request.getInstruction());
        medicineSubmission.setDuration(duration);
        medicineSubmission.setStartDate(request.getStartDate());
        medicineSubmission.setEndDate(request.getEndDate());
        medicineSubmission.setNotes(request.getNotes());
        medicineSubmission.setSubmissionStatus(MedicineSubmissionStatus.PENDING);
        medicineSubmission.setImageData(encodedImage);

        //Map the medicine details from request to entity
//        List<MedicineDetail> medicineDetails = request.getMedicineDetails().stream()
//                .map(detail -> {
//                    MedicineDetail medicineDetail = new MedicineDetail();
//                    medicineDetail.setMedicineName(detail.getMedicineName());
//                    medicineDetail.setMedicineDosage(detail.getMedicineDosage());
//                    medicineDetail.setMedicineSubmission(medicineSubmission);
//                    return medicineDetail;
//                }).collect(Collectors.toList());
//        medicineSubmission.setMedicineDetails(medicineDetails);

        // Create medicine logs for each day, skipping weekends
        LocalDate currentDate = request.getStartDate();
        while (!currentDate.isAfter(request.getEndDate())) {
            DayOfWeek dayOfWeek = currentDate.getDayOfWeek();
            // Only create a log if the day is not Saturday or Sunday
            if (dayOfWeek != DayOfWeek.SATURDAY && dayOfWeek != DayOfWeek.SUNDAY) {
                MedicineLog log = new MedicineLog();
                log.setGivenAt(currentDate);
                log.setStatus(false);
                medicineSubmission.addMedicineLog(log);
            }
            // Move to the next day
            currentDate = currentDate.plusDays(1);
        }

        //Save the MedicineSubmission entity
        medicineSubmissionRepository.save(medicineSubmission);
        userRepository.findAllAdminAndNurse().forEach(user -> {notificationService.createNotification(user.getUserId(),"Có đơn thuốc chờ bạn xử lí", "Có đơn gửi thuốc từ phụ huynh "+ medicineSubmission.getParent().getFullName()+ " xin vui lòng kiểm tra");});
        //Return the saved submission
        return toResponse(medicineSubmission);
    }

    private MedicineSubmissionResponse toResponse(MedicineSubmission submission, boolean includeLogsData) {
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
//        resp.setMedicineDetails(
//                submission.getMedicineDetails() != null ?
//                        submission.getMedicineDetails().stream().map(detail -> {
//                            MedicineDetailResponse d = new MedicineDetailResponse();
//                            d.setId(detail.getId());
//                            d.setMedicineName(detail.getMedicineName());
//                            d.setMedicineDosage(detail.getMedicineDosage());
//                            return d;
//                        }).collect(Collectors.toList())
//                        : Collections.emptyList()
//        );
        resp.setImageData(submission.getImageData());
        // Chỉ bao gồm logs cho NURSE
        if (includeLogsData) {
            resp.setMedicineLogs(submission.getMedicineLogs().stream()
                    .map(this::toLogResponse)
                    .sorted(Comparator.comparing(MedicineLogResponse::getGivenAt))
                    .collect(Collectors.toList()));
        }

        return resp;
    }

    private MedicineSubmissionResponse toResponse(MedicineSubmission submission) {
        return toResponse(submission, false);
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
        MedicineSubmission submission = medicineSubmissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn thuốc: " + id));

        // Kiểm tra trạng thái hiện tại và quy tắc chuyển đổi
        if (submission.getSubmissionStatus() == MedicineSubmissionStatus.PENDING) {
            // Nếu đang PENDING thì chỉ có thể chuyển sang APPROVED hoặc REJECTED
            if (!"APPROVED".equals(request.getSubmissionStatus()) && !"REJECTED".equals(request.getSubmissionStatus())) {
                throw new BadRequestException("Đơn thuốc đang chờ duyệt chỉ có thể được phê duyệt hoặc từ chối");
            }
        } else if (submission.getSubmissionStatus() == MedicineSubmissionStatus.APPROVED) {
            // Nếu đang APPROVED thì chỉ có thể chuyển sang COMPLETE
            if (!"COMPLETE".equals(request.getSubmissionStatus())) {
                throw new BadRequestException("Đơn thuốc đã được phê duyệt chỉ có thể chuyển sang trạng thái hoàn thành");
            }
        } else {
            // Các trạng thái khác không được phép cập nhật
            throw new BadRequestException("Không thể cập nhật trạng thái của đơn thuốc này");
        }

        User approvedBy = userRepository.findById(request.getApprovedBy())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng: " + request.getApprovedBy()));

        submission.setSubmissionStatus(MedicineSubmissionStatus.valueOf(request.getSubmissionStatus()));
        submission.setApprovedBy(approvedBy);
        submission.setApprovedAt(request.getApprovedAt());

        medicineSubmissionRepository.save(submission);
        String status = request.getSubmissionStatus().equals("APPROVED") ? "chấp nhận" : "từ chối";
        notificationService.createNotification(submission.getParent().getUserId(),"Yêu cầu gửi thuốc của bạn đã có kết quả", "Yêu cầu gửi thuốc của bạn đã được "+ status + " bởi "+submission.getApprovedBy().getFullName()+" vào "+ submission.getApprovedAt());
        return toResponse(submission);
    }

    @Override
    public void delete(Integer id) {
        if (!medicineSubmissionRepository.existsById(id)) {
            throw new ResourceNotFoundException("Không tìm thấy đơn thuốc: " + id);
        }
        medicineSubmissionRepository.deleteById(id);
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
                throw new BadRequestException("Trạng thái không hợp lệ: " + status);
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
    public MedicineLogResponse markMedicineTaken(Integer submissionId, MedicineLogRequest request, MultipartFile image) {
        MedicineSubmission submission = medicineSubmissionRepository.findById(submissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Submission not found: " + submissionId));

        if (submission.getSubmissionStatus() != MedicineSubmissionStatus.APPROVED) {
            throw new BadRequestException("Chỉ có thể chấm công cho các đơn thuốc đã được phê duyệt");
        }

        User givenBy = userRepository.findById(request.getGivenByUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + request.getGivenByUserId()));

        // Find and update existing log for the given date
        MedicineLog log = submission.getMedicineLogs().stream()
                .filter(l -> l.getGivenAt().equals(request.getGivenAt()))
                .findFirst()
                .orElseThrow(() -> new BadRequestException("Không tìm thấy lịch uống thuốc cho ngày: " + request.getGivenAt()));

        // Update the log details
        log.setGivenBy(givenBy);
//        log.setGivenAt(request.getGivenAt());
        log.setNotes(request.getNotes());
        log.setStatus(true); // Mark as taken

        // Handle image upload
        String encodedImage = null;
        if (image != null) {
            try {
                // Check file size (max 5MB)
                if (image.getSize() > 5 * 1024 * 1024) {
                    throw new BadRequestException("Kích thước ảnh không được vượt quá 5MB");
                }

                // Check file type
                List<String> allowedTypes = Arrays.asList("image/jpeg", "image/png", "image/jpg");
                if (!allowedTypes.contains(image.getContentType())) {
                    throw new BadRequestException("Chỉ chấp nhận file ảnh (JPEG, PNG, JPG)");
                }

                // Convert to Base64
                byte[] imageBytes = image.getBytes();
                String contentType = image.getContentType();
                encodedImage = "data:" + contentType + ";base64," + Base64.getEncoder().encodeToString(imageBytes);

            } catch (IOException e) {
                throw new BadRequestException("Lỗi xử lý ảnh: " + e.getMessage());
            }
        }
        // Set the image data if provided
        if (encodedImage != null) {
            log.setImageData(encodedImage);
        }

        medicineLogRepository.save(log);

        return toLogResponse(log);
    }

    private MedicineLogResponse toLogResponse(MedicineLog log) {
        MedicineLogResponse response = new MedicineLogResponse();
        response.setId(log.getMedicineLogId());
        response.setSubmissionId(log.getMedicineSubmission().getMedicineSubmissionId());
        // Xử lý null safety cho givenBy
        if (log.getGivenBy() != null) {
            response.setGivenByUserId(log.getGivenBy().getUserId());
            response.setGivenByName(log.getGivenBy().getFullName());
        }
        response.setGivenAt(log.getGivenAt());
        response.setNotes(log.getNotes());
        response.setStatus(log.isStatus());
        // Chỉ set imageData nếu có
        if (log.getImageData() != null) {
            response.setImageData(log.getImageData());
        }
        return response;
    }

    @Override
    public MedicineSubmissionResponse getByIdWithLog(Integer id) {
        MedicineSubmission submission = medicineSubmissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Submission not found: " + id));

        return toResponse(submission, true);
    }
}
