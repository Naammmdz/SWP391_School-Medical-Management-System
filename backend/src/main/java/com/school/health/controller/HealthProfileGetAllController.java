package com.school.health.controller;

import com.school.health.service.HealthProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/health-profile")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Cho phép React frontend gọi API
@Validated
public class HealthProfileGetAllController {

    private final HealthProfileService service;



    @GetMapping("/{userId}")
    public ResponseEntity<?> getAllHealthProfiles( @PathVariable Integer userId) {
        return ResponseEntity.ok(service.getHealthProfilesByParentId(userId));
    }

    /**
     * Lấy danh sách sức khỏe của tất cả học sinh không cần id
     */
    @GetMapping("/all")
    public ResponseEntity<?> getAllHealthProfiles() {
        return ResponseEntity.ok(service.getAllHealthProfiles());
    }




}