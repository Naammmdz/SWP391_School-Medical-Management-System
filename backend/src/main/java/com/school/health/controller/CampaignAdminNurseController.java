package com.school.health.controller;

import com.school.health.dto.request.HealthCampaignRequestDTO;
import com.school.health.service.impl.HealthCheckCampaignServiceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/api/admin/vaccination-campaigns")
@RestController
@Validated
public class CampaignAdminNurseController {
    HealthCheckCampaignServiceImpl healthCheckCampaignServiceImpl;


    @PostMapping
    public ResponseEntity<?> createCampaign(@RequestBody HealthCampaignRequestDTO healthCampaignRequestDTO) {
        return ResponseEntity.ok(healthCheckCampaignServiceImpl.createCampaign(healthCampaignRequestDTO));
    }

}
