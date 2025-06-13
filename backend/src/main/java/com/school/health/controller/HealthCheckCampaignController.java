package com.school.health.controller;

import com.school.health.dto.request.HealthCampaignRequestDTO;
import com.school.health.dto.request.HealthCheckRequestDTO;
import com.school.health.dto.response.HealthCampaignResponseDTO;
import com.school.health.enums.Status;
import com.school.health.security.services.UserDetailsImpl;
import com.school.health.service.impl.HealthCheckCampaignServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/api/healthcheck-campaigns")
@RestController
@Validated
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600) // Cho phép React frontend gọi API
public class HealthCheckCampaignController {
    private final HealthCheckCampaignServiceImpl healthCheckCampaignServiceImpl;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('NURSE')")
    public ResponseEntity<?> createCampaign(@RequestBody HealthCampaignRequestDTO healthCampaignRequestDTO, Authentication authentication) {
        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();
        Integer userId = userPrincipal.getId();
        HealthCampaignResponseDTO healthCampaignResponseDTO = healthCheckCampaignServiceImpl.createCampaign(healthCampaignRequestDTO, userId);
        return ResponseEntity.ok(healthCampaignResponseDTO);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('NURSE') or hasRole('PRINCIPAL')")
    public ResponseEntity<?> getAllCampaigns() {
        return ResponseEntity.ok(healthCheckCampaignServiceImpl.getAllCampaigns());
    }

    @GetMapping("/{campaignId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('NURSE')")
    public ResponseEntity<?> getCampaignById(@PathVariable int campaignId) {
        return ResponseEntity.ok(healthCheckCampaignServiceImpl.getCampaignById(campaignId));
    }

    @PutMapping("/{campaignId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('NURSE')")
    public ResponseEntity<?> updateCampaign(@PathVariable int campaignId, @RequestBody HealthCampaignRequestDTO healthCampaignRequestDTO) {
        HealthCampaignResponseDTO healthCampaignResponseDTO = healthCheckCampaignServiceImpl.updateCampaign(campaignId, healthCampaignRequestDTO);
        return ResponseEntity.ok(healthCampaignResponseDTO);
    }

    @PutMapping("/{campaignId}/approve")
    @PreAuthorize("hasRole('ADMIN') or hasRole('NURSE') or hasRole('PRINCIPAL')")
    public ResponseEntity<?> approveCampaign(@PathVariable int campaignId, Authentication authentication) {
        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();
        Integer approvedBy = userPrincipal.getId();
        HealthCampaignResponseDTO healthCampaignResponseDTO = healthCheckCampaignServiceImpl.approveCampaign(campaignId, approvedBy);
        return ResponseEntity.ok(healthCampaignResponseDTO);
    }

    @PutMapping("/{campaignId}/status/{status}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('NURSE') or hasRole('PRINCIPAL')")
    public ResponseEntity<?> updateCampaignStatus(@PathVariable int campaignId, @PathVariable Status status) {
        HealthCampaignResponseDTO healthCampaignResponseDTO = healthCheckCampaignServiceImpl.updateCampaignStatus(campaignId, status);
        return ResponseEntity.ok(healthCampaignResponseDTO);
    }

    // Endpoint để lấy danh sách đăng ký của học sinh trong chiến dịch sức khỏe
    // Tức là danh sách học sinh đã được parentConfirmation với bit status = 1
    @GetMapping("{campaignId}/students-registrations")
    @PreAuthorize("hasRole('ADMIN') or hasRole('NURSE') or hasRole('PRINCIPAL')")
    public ResponseEntity<?> getStudentsRegistrations(@PathVariable int campaignId) {
        return ResponseEntity.ok(healthCheckCampaignServiceImpl.getStudentsRegistrations(campaignId));
    }

    // Xem danh sách chiến dịch đã được phê duyệt dành cho phụ huynh
    @GetMapping("/approved")
    @PreAuthorize("hasRole('PARENT')")
    public ResponseEntity<?> getApprovedCampaign() {
        return ResponseEntity.ok(healthCheckCampaignServiceImpl.getApprovedCampaigns());
    }

    // Phụ huynh đăng ký cho học sinh tham gia chiến dịch sức khỏe
    @PostMapping("/{campaignId}/student/{studentId}/register")
    @PreAuthorize("hasRole('PARENT') or hasRole('NURSE') or hasRole('ADMIN')")
    public ResponseEntity<?> registerStudentForHealthCampaign(@PathVariable int campaignId, @PathVariable int studentId, Authentication authentication) {
        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();
        Integer userId = userPrincipal.getId();
        HealthCheckRequestDTO dto = new HealthCheckRequestDTO();
        dto.setCampaignId(campaignId);
        dto.setStudentId(studentId);
        return ResponseEntity.ok(healthCheckCampaignServiceImpl.registerStudentHealthCheck(dto));
    }

}
