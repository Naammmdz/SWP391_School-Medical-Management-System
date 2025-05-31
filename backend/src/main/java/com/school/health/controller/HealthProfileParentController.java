//package com.school.health.controller;
//
//
//import com.school.health.dto.request.CreateHealthProfileDTO;
//import com.school.health.dto.request.UpdateHealthProfileDTO;
//import com.school.health.dto.response.HealthProfileResponseDTO;
//import com.school.health.service.HealthProfileService;
//import jakarta.validation.Valid;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.*;
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@RequestMapping("/api/parent/students/{studentId}/health-profile")
//@RequiredArgsConstructor
//@CrossOrigin(origins = "*") // Cho phép React frontend gọi API
//public class HealthProfileParentController {
//
//    private final HealthProfileService service;
//
//    @PostMapping
//    public ResponseEntity<?> createHealthProfileParents(
//            @PathVariable Integer studentId,
//            @RequestBody CreateHealthProfileDTO healthProfileDTO) {
//        HealthProfileResponseDTO response = service.createHealthProfile(studentId, healthProfileDTO);
//        return ResponseEntity.ok(response);
//    }
//
//
//
//
//}