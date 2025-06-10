package com.school.health.service.impl;

import com.school.health.dto.request.MedicineSubmissionRequest;
import com.school.health.dto.request.StatusUpdateRequest;
import com.school.health.dto.response.MedicineDetailResponse;
import com.school.health.dto.response.MedicineSubmissionResponse;
import com.school.health.entity.MedicineDetail;
import com.school.health.entity.MedicineSubmission;
import com.school.health.entity.Student;
import com.school.health.entity.User;
import com.school.health.enums.MedicineSubmissionStatus;
import com.school.health.exception.BadRequestException;
import com.school.health.exception.ResourceNotFoundException;
import com.school.health.repository.MedicineSubmissionRepository;
import com.school.health.repository.StudentRepository;
import com.school.health.repository.UserRepository;
import com.school.health.service.MedicineSubmissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MedicineSubmissionServiceImpl implements MedicineSubmissionService {

    @Autowired
    private MedicineSubmissionRepository medicineSubmissionRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private UserRepository userRepository;

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
    public List<MedicineSubmissionResponse> getAllMedicineSubmissions(Integer studentId, Integer parentId, Integer submissionStatus) {
        return List.of();
    }

    @Override
    public MedicineSubmissionResponse getMedicineSubmissionById(Integer submissionId) {
        return null;
    }

    @Override
    public MedicineSubmissionResponse updateStatus(Integer id, StatusUpdateRequest request) {
        return null;
    }

    @Override
    public void deleteMedicineSubmission(Integer submissionId) {

    }
}
