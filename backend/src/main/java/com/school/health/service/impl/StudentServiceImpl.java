package com.school.health.service.impl;

import com.school.health.dto.request.CreateHealthProfileDTO;
import com.school.health.dto.request.StudentRequestDTO;
import com.school.health.dto.response.StudentResponseDTO;
import com.school.health.entity.Student;
import com.school.health.entity.User;
import com.school.health.exception.ResourceNotFoundException;
import com.school.health.repository.StudentRepository;
import com.school.health.repository.UserRepository;
import com.school.health.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService {
    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    /**
     * Lấy danh sách học sinh theo parent ID
     */
    public List<StudentResponseDTO> getStudentsByParentId(Integer parentId) {
        List<Student> students = studentRepository.findByParentUserId(parentId);

        return students.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Lấy thông tin học sinh theo ID
     */
    public StudentResponseDTO getStudentById(Integer studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy học sinh với ID: " + studentId));

        return mapToResponseDTO(student);
    }

    /**
     * Lấy danh sách học sinh chưa có hồ sơ sức khỏe
     */
    public List<StudentResponseDTO> getStudentsWithoutHealthProfile() {
        List<Student> students = studentRepository.findStudentsWithoutHealthProfile();
        return students.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Tìm kiếm học sinh theo tên
     */
    public List<StudentResponseDTO> searchStudentsByName(String name) {
        List<Student> students = studentRepository.findByFullNameContainingIgnoreCase(name);

        return students.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Lấy danh sách học sinh theo lớp
     */
    public List<StudentResponseDTO> getStudentsByClassName(String className) {
        List<Student> students = studentRepository.findByClassName(className);

        return students.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }


    public StudentResponseDTO mapToResponseDTO(Student student) {
        StudentResponseDTO dto = new StudentResponseDTO();
        dto.setStudentId(student.getStudentId());
        dto.setFullName(student.getFullName());
        dto.setDob(student.getDob());
        dto.setGender(student.getGender());
        dto.setClassName(student.getClassName());
        dto.setParentId(student.getParent().getUserId());
        dto.setCreatedAt(student.getCreatedAt());
        dto.setHasHealthProfile(student.getHealthProfile() != null);
        return dto;
    }

    public List<StudentResponseDTO> createStudent(StudentRequestDTO dto) {
        // 1. Tìm phụ huynh theo parentId
        User parent = userRepository.findById(dto.getParentId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phụ huynh với ID: " + dto.getParentId()));

        // 2. Tạo mới student và gán parent
        Student student = new Student();
        student.setFullName(dto.getFullName());
        student.setDob(dto.getYob());
        student.setGender(dto.getGender());
        student.setClassName(dto.getClassName());
        student.setParent(parent); // Gán parent đã lấy ở bước 1

        // 3. Lưu vào DB
        Student savedStudent = studentRepository.save(student);

        return List.of(mapToResponseDTO(savedStudent));
    }

    public List<StudentResponseDTO> getAllStudents() {
        List<Student> students = studentRepository.findAll();
        return students.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }
}