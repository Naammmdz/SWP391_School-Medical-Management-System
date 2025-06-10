package com.school.health.controller;

import com.school.health.dto.request.HealthCampaignRequestDTO;
import com.school.health.dto.response.HealthCampaignResponseDTO;
import com.school.health.service.impl.HealthCheckCampaignServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/api/admin/vaccination-campaigns")
@RestController
@Validated
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600) // Cho phép React frontend gọi API
public class CampaignAdminNurseController {
    private final HealthCheckCampaignServiceImpl healthCheckCampaignServiceImpl;

    @PostMapping("/{createdBy}/{appovedBy}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createCampaign(@RequestBody HealthCampaignRequestDTO healthCampaignRequestDTO, @PathVariable int createdBy, @PathVariable int appovedBy) {
        HealthCampaignResponseDTO healthCampaignResponseDTO = healthCheckCampaignServiceImpl.createCampaign(healthCampaignRequestDTO, createdBy, appovedBy);
        return ResponseEntity.ok(healthCampaignResponseDTO);
    }
}
