package com.school.health.controller;

import com.school.health.dto.request.HealthCampaignRequestDTO;
import com.school.health.dto.response.HealthCampaignResponseDTO;
import com.school.health.enums.Status;
import com.school.health.service.impl.HealthCheckCampaignServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/api/admin/healthcheck-campaigns")
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

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllCampaigns() {
        return ResponseEntity.ok(healthCheckCampaignServiceImpl.getAllCampaigns());
    }

    @GetMapping("/{campaignId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getCampaignById(@PathVariable int campaignId) {
        return ResponseEntity.ok(healthCheckCampaignServiceImpl.getCampaignById(campaignId));
    }

    @PutMapping("/{campaignId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateCampaign(@PathVariable int campaignId, @RequestBody HealthCampaignRequestDTO healthCampaignRequestDTO) {
        HealthCampaignResponseDTO healthCampaignResponseDTO = healthCheckCampaignServiceImpl.updateCampaign(campaignId, healthCampaignRequestDTO);
        return ResponseEntity.ok(healthCampaignResponseDTO);
    }

    @PutMapping("/{campaignId}/approve/{approvedBy}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> approveCampaign(@PathVariable int campaignId, @PathVariable int approvedBy) {
        HealthCampaignResponseDTO healthCampaignResponseDTO = healthCheckCampaignServiceImpl.approveCampaign(campaignId, approvedBy);
        return ResponseEntity.ok(healthCampaignResponseDTO);
    }

    @PutMapping("/{campaignId}/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateCampaignStatus(@PathVariable int campaignId, @PathVariable Status status) {
        HealthCampaignResponseDTO healthCampaignResponseDTO = healthCheckCampaignServiceImpl.updateCampaignStatus(campaignId, status);
        return ResponseEntity.ok(healthCampaignResponseDTO);
    }

}
