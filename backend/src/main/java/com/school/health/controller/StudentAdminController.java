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
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/students")
@CrossOrigin(origins = "*") // Cho phép React frontend gọi API
@RequiredArgsConstructor
@Validated
public class StudentAdminController {
    private final HealthProfileService service;
    private final StudentServiceImpl studentService;

    @PostMapping("/create-students")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createStudents(@RequestBody @Valid StudentRequestDTO studentRequest) {
        return ResponseEntity.ok(studentService.createStudent(studentRequest));
    }


    @GetMapping
    public ResponseEntity<?> getAllStudents() {
        return ResponseEntity.ok(studentService.getAllStudents());
    }

    @GetMapping("list/{studentId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getStudentById(@PathVariable @Valid Integer studentId) {
        return ResponseEntity.ok(studentService.getStudentById(studentId));
    }

    @PutMapping("/{studentId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateStudent(@PathVariable @Valid Integer studentId, @RequestBody @Valid StudentRequestDTO studentRequest) {
        return ResponseEntity.ok(studentService.updateStudent(studentId, studentRequest));
    }

    @DeleteMapping("/{studentId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteStudent(@PathVariable @Valid Integer studentId) {
        studentService.deleteStudent(studentId);
        return ResponseEntity.ok("Xóa học sinh thành công");
    }

    @GetMapping("/{parentId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getStudentsByParentId(@PathVariable @Valid Integer parentId) {
        return ResponseEntity.ok(studentService.getStudentsByParentId(parentId));
    }

}
