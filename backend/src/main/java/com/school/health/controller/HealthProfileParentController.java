package com.school.health.controller;

import com.school.health.dto.request.UpdateHealthProfileDTO;
import com.school.health.dto.response.HealthProfileResponseDTO;
import com.school.health.service.HealthProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/parent/{userId}/students/{studentId}/health-profile")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Cho phép React frontend gọi API
@Validated
public class HealthProfileParentController {

    private final HealthProfileService service;

    @GetMapping
    public ResponseEntity<?> getHealthProfile(@PathVariable Integer studentId) {
        HealthProfileResponseDTO response = service.getHealthProfileByStudentId(studentId);
        return ResponseEntity.ok(response);
    }

    @PutMapping
    public ResponseEntity<?> updateHealthProfile(@PathVariable Integer studentId, @RequestBody @Valid UpdateHealthProfileDTO healthProfile, @PathVariable Integer userId) {
        HealthProfileResponseDTO response = service.updateHealthProfile(studentId, healthProfile, userId);
        return ResponseEntity.ok(response);
    }







}