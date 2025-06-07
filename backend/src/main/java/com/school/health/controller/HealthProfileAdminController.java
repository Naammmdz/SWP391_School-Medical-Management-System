package com.school.health.controller;

import com.school.health.dto.request.CreateHealthProfileDTO;
import com.school.health.dto.request.StudentRequestDTO;
import com.school.health.dto.request.HealthProfileFilterRequest;
import com.school.health.dto.request.UpdateHealthProfileDTO;
import com.school.health.dto.response.HealthProfileResponseDTO;
import com.school.health.service.HealthProfileService;
import com.school.health.service.impl.StudentServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/students")
@CrossOrigin(origins = "*") // Cho phép React frontend gọi API
@RequiredArgsConstructor
@Validated
public class HealthProfileAdminController {
    private final HealthProfileService service;
    private final StudentServiceImpl studentService;

//    @PostMapping("/{userId}/{studentId}/health-profile")
//    public ResponseEntity<?> createHealthProfile(@PathVariable Integer studentId, @RequestBody @Valid CreateHealthProfileDTO healthProfile, @PathVariable Integer userId) {
//        HealthProfileResponseDTO response = service.createHealthProfile(studentId, healthProfile, userId);
//        return ResponseEntity.ok(response);
//    }

    @GetMapping("/health-profile/{studentId}")
    public ResponseEntity<?> getHealthProfile(@PathVariable Integer studentId) {
        HealthProfileResponseDTO response = service.getHealthProfileByStudentId(studentId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{userId}/{studentId}/health-profile")
    public ResponseEntity<?> updateHealthProfile(@PathVariable Integer studentId, @RequestBody @Valid UpdateHealthProfileDTO healthProfile, @PathVariable Integer userId) {
        HealthProfileResponseDTO response = service.updateHealthProfile(studentId, healthProfile, userId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/filter")
    public ResponseEntity<?> filterHealthProfiles(
          @RequestBody @Valid HealthProfileFilterRequest filterRequest
    ) {
        return ResponseEntity.ok(service.filterHealthProfiles(filterRequest));
    }

    @PostMapping("/create-students")
    public ResponseEntity<?> createStudents(@RequestBody @Valid StudentRequestDTO studentRequest) {
        return ResponseEntity.ok(studentService.createStudent(studentRequest));
    }

    // Bên trong HealthProfileAdminController hoặc một StudentController mới

    @GetMapping("/")
    public ResponseEntity<?> getAllStudents() {
        // Giả sử studentService có phương thức để lấy tất cả student
         return ResponseEntity.ok(studentService.getAllStudents());
        // Hoặc nếu bạn muốn trả về health profiles mặc định ở đây:
        // return ResponseEntity.ok(service.getAllHealthProfiles()); // Bạn cần tạo method này trong service

    }

    @GetMapping("list/{studentId}")
    public ResponseEntity<?> getStudentById(@PathVariable Integer studentId) {
        return ResponseEntity.ok(studentService.getStudentById(studentId));
    }

    @PutMapping("/{studentId}")
    public ResponseEntity<?> updateStudent(@PathVariable Integer studentId, @RequestBody @Valid StudentRequestDTO studentRequest) {
        return ResponseEntity.ok(studentService.updateStudent(studentId, studentRequest));
    }

    @DeleteMapping("/{studentId}")
    public ResponseEntity<?> deleteStudent(@PathVariable Integer studentId) {
        studentService.deleteStudent(studentId);
        return ResponseEntity.ok("Xóa học sinh thành công");
    }

}
