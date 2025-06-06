package com.school.health.controller;

import com.school.health.dto.request.CreateHealthProfileDTO;
import com.school.health.dto.request.HealthProfileFilterRequest;
import com.school.health.dto.request.UpdateHealthProfileDTO;
import com.school.health.dto.response.HealthProfileResponseDTO;
import com.school.health.service.HealthProfileService;
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

    @PostMapping("/{userId}/{studentId}/health-profile")
    public ResponseEntity<?> createHealthProfile(@PathVariable Integer studentId, @RequestBody @Valid CreateHealthProfileDTO healthProfile, @PathVariable Integer userId) {
        HealthProfileResponseDTO response = service.createHealthProfile(studentId, healthProfile, userId);
        return ResponseEntity.ok(response);
    }

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

}
