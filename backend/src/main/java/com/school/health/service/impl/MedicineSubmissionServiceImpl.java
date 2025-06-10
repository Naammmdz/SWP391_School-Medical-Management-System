package com.school.health.service.impl;

import com.school.health.dto.request.MedicineSubmissionRequest;
import com.school.health.dto.request.StatusUpdateRequest;
import com.school.health.dto.response.MedicineSubmissionResponse;
import com.school.health.entity.MedicineSubmission;
import com.school.health.entity.Student;
import com.school.health.entity.User;
import com.school.health.exception.BadRequestException;
import com.school.health.exception.ResourceNotFoundException;
import com.school.health.repository.MedicineSubmissionRepository;
import com.school.health.repository.StudentRepository;
import com.school.health.repository.UserRepository;
import com.school.health.service.MedicineSubmissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MedicineSubmissionServiceImpl implements MedicineSubmissionService {

    @Autowired
    private MedicineSubmissionRepository medicineSubmissionRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public MedicineSubmission createMedicineSubmission(MedicineSubmissionRequest request) {
        //Validate the request: ngay ket thuc >= ngay bat dau
        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new BadRequestException("Ngày kết thúc phải sau hoặc bằng ngày bắt đầu");
        }
        //Validate: học sinh và phụ huynh có tồn tại
        Optional<Student> student = Optional.ofNullable(studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found: " + request.getStudentId())));
        Optional<User> parent = Optional.ofNullable(userRepository.findById(request.getParentId())
                .orElseThrow(() -> new ResourceNotFoundException("Parent not found: " + request.getParentId())));
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
