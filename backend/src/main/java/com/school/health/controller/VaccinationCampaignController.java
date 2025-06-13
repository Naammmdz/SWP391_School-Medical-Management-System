package com.school.health.controller;

import com.school.health.dto.request.VaccinationCampaignRequestDTO;
import com.school.health.enums.Status;
import com.school.health.security.services.UserDetailsImpl;
import com.school.health.service.impl.VaccinationCampaignServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/vaccination-campaigns")
@CrossOrigin(origins = "*")
@Validated
@RequiredArgsConstructor
public class VaccinationCampaignController {
    private final VaccinationCampaignServiceImpl vaccinationCampaignService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('NURSE')")
    public ResponseEntity<?> createVaccinationCampaign(@RequestBody VaccinationCampaignRequestDTO vaccine, Authentication authentication) {
        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();
        Integer userId = userPrincipal.getId();
        return ResponseEntity.ok(vaccinationCampaignService.createVaccinationCampaign(vaccine,userId));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('NURSE')")
    public ResponseEntity<?> getAllVaccinationCampaigns() {
        return ResponseEntity.ok(vaccinationCampaignService.getAllVaccinationCampaigns());
    }

    @GetMapping("/{campaignId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('NURSE')")
    public ResponseEntity<?> getVaccinationCampaignById(@PathVariable int campaignId) {
        return ResponseEntity.ok(vaccinationCampaignService.getVaccinationCampaignById(campaignId));
    }

    @PutMapping("/{campaignId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('NURSE')")
    public ResponseEntity<?> updateVaccinationCampaign(@PathVariable int campaignId, @RequestBody VaccinationCampaignRequestDTO vaccine) {
        return ResponseEntity.ok(vaccinationCampaignService.updateVaccinationCampaign(campaignId, vaccine));
    }

    @PutMapping("/{campaignId}/approve")
//    @PreAuthorize("hasRole('ADMIN') or hasRole('NURSE')")
    public ResponseEntity<?> approveVaccinationCampaign(@PathVariable int campaignId, Authentication authentication) {
        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();
        Integer approvedBy = userPrincipal.getId();
        return ResponseEntity.ok(vaccinationCampaignService.approveVaccinationCampaign(campaignId, approvedBy));
    }

    @PutMapping("/{campaignId}/status/{status}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('NURSE')")
    public ResponseEntity<?> updateVaccinationCampaignStatus(@PathVariable int campaignId, @PathVariable Status status) {
        return ResponseEntity.ok(vaccinationCampaignService.updateVaccinationCampaignStatus(campaignId, status));
    }

    // danh sách học sinh đã đăng ký tiêm chủng trong chiến dịch
    @GetMapping("/{campaignId}/students-registrations")
    @PreAuthorize("hasRole('ADMIN') or hasRole('NURSE')")
    public ResponseEntity<?> getStudentsRegistrationsInCampaign(@PathVariable int campaignId) {
        return ResponseEntity.ok(vaccinationCampaignService.getStudentsRegistrations(campaignId));
    }

    @GetMapping("/approved")
    @PreAuthorize("hasRole('PARENT')")
    public ResponseEntity<?> getApprovedVaccinationCampaigns() {
        return ResponseEntity.ok(vaccinationCampaignService.getApprovedVaccination());
    }

}
