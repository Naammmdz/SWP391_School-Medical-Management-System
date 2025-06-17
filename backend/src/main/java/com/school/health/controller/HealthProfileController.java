package com.school.health.controller;

import com.school.health.dto.request.HealthProfileFilterRequest;
import com.school.health.dto.request.UpdateHealthProfileDTO;
import com.school.health.dto.response.HealthProfileResponseDTO;
import com.school.health.security.services.UserDetailsImpl;
import com.school.health.service.HealthProfileService;
import com.school.health.service.impl.StudentServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "*") // Cho phép React frontend gọi API
@RequiredArgsConstructor
@Validated
public class HealthProfileController {
    private final HealthProfileService service;
    private final StudentServiceImpl studentService;

    @GetMapping("/health-profile/{studentId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('NURSE') or hasRole('PARENT')")
    public ResponseEntity<?> getHealthProfile(@PathVariable Integer studentId) {
        HealthProfileResponseDTO response = service.getHealthProfileByStudentId(studentId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{studentId}/health-profile")
    @PreAuthorize("hasRole('ADMIN') or hasRole('NURSE') or hasRole('PARENT')")

    public ResponseEntity<?> updateHealthProfile(@PathVariable Integer studentId, @RequestBody @Valid UpdateHealthProfileDTO healthProfile, Authentication authentication) {
        Integer userId = ((UserDetailsImpl) authentication.getPrincipal()).getId();
        HealthProfileResponseDTO response = service.updateHealthProfile(studentId, healthProfile, userId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/filter")
    @PreAuthorize("hasRole('ADMIN') or hasRole('NURSE')")
    public ResponseEntity<?> filterHealthProfiles(
          @RequestBody @Valid HealthProfileFilterRequest filterRequest
    ) {
        return ResponseEntity.ok(service.filterHealthProfiles(filterRequest));
    }


    // lấy danh sách sức khỏe của tất cả học sinh theo id phụ huynh
    @GetMapping("/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllHealthProfiles( @PathVariable Integer userId) {
        return ResponseEntity.ok(service.getHealthProfilesByParentId(userId));
    }


    // lấy danh sách sức khỏe của tất cả học sinh không cần id
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllHealthProfiles() {
        return ResponseEntity.ok(service.getAllHealthProfiles());
    }






}
