package com.school.health.controller;

import com.school.health.dto.request.CreateHealthProfileDTO;
import com.school.health.dto.request.UpdateHealthProfileDTO;
import com.school.health.dto.response.HealthProfileResponseDTO;
import com.school.health.service.HealthProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/students/{studentId}/health-profile")
@CrossOrigin(origins = "*") // Cho phép React frontend gọi API
@RequiredArgsConstructor
public class HealthProfileAdminController {
    private final HealthProfileService service;

    @PostMapping
    public ResponseEntity<?> createHealthProfile(@PathVariable Integer studentId,@RequestBody CreateHealthProfileDTO healthProfile) {
        HealthProfileResponseDTO response = service.createHealthProfile(studentId, healthProfile);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<?> getHealthProfile(@PathVariable Integer studentId) {
        HealthProfileResponseDTO response = service.getHealthProfileByStudentId(studentId);
        return ResponseEntity.ok(response);
    }

    @PutMapping
    public ResponseEntity<?> updateHealthProfile(@PathVariable Integer studentId, @RequestBody UpdateHealthProfileDTO healthProfile) {
        HealthProfileResponseDTO response = service.updateHealthProfile(studentId, healthProfile);
        return ResponseEntity.ok(response);
    }
}
