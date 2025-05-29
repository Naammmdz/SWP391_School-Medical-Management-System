package com.school.health.controller;

import com.school.health.entity.Users;
import com.school.health.dto.request.HealthProfileParentRequestDTO;
import com.school.health.dto.response.HealthProfileResponseDTO;
import com.school.health.service.HealthProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/parent")
@RequiredArgsConstructor
public class HealthProfileParentController {

    private final HealthProfileService service;

    @PostMapping("/health-profiles")
    public ResponseEntity<HealthProfileResponseDTO> updateHealthProfileForStudent(
            @RequestParam Long studentId,
            @Valid @RequestBody HealthProfileParentRequestDTO dto,
            @AuthenticationPrincipal Users parent
    ) {
        HealthProfileResponseDTO response = service.updateHealthProfileForParent(studentId, dto, parent);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/health-profiles")
    public ResponseEntity<List<HealthProfileResponseDTO>> getHealthProfilesForParent(
            @AuthenticationPrincipal Users parent
    ) {
        List<HealthProfileResponseDTO> responses = service.getAllHealthProfilesForParent(parent);
        return ResponseEntity.ok(responses);
    }
}
