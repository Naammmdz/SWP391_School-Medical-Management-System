package com.school.health.controller;

import com.school.health.dto.request.HealthCampaignRequestDTO;
import com.school.health.dto.request.HealthCheckRequestDTO;
import com.school.health.dto.response.HealthCampaignResponseDTO;
import com.school.health.enums.Status;
import com.school.health.security.services.UserDetailsImpl;
import com.school.health.service.impl.HealthCheckCampaignServiceImpl;
import jakarta.validation.Valid;
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

    // tạo chiến dịch sức khỏe
    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('NURSE')")
    public ResponseEntity<?> createCampaign(@Valid @RequestBody HealthCampaignRequestDTO healthCampaignRequestDTO, Authentication authentication) {
        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();
        Integer userId = userPrincipal.getId();
        HealthCampaignResponseDTO healthCampaignResponseDTO = healthCheckCampaignServiceImpl.createCampaign(healthCampaignRequestDTO, userId);
        return ResponseEntity.ok(healthCampaignResponseDTO);
    }

    // lấy full danh sách chiến dịch sức khỏe
    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('NURSE') or hasRole('PRINCIPAL')")
    public ResponseEntity<?> getAllCampaigns() {
        return ResponseEntity.ok(healthCheckCampaignServiceImpl.getAllCampaigns());
    }

    // lấy danh sách chiến dịch sức khỏe đã được phê duyệt
    @GetMapping("/{campaignId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('NURSE')")
    public ResponseEntity<?> getCampaignById(@PathVariable int campaignId) {
        return ResponseEntity.ok(healthCheckCampaignServiceImpl.getCampaignById(campaignId));
    }


    // Cập nhật thông tin chiến dịch sức khỏe theo ID
    @PutMapping("/{campaignId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('NURSE')")
    public ResponseEntity<?> updateCampaign(@PathVariable int campaignId, @RequestBody HealthCampaignRequestDTO healthCampaignRequestDTO) {
        HealthCampaignResponseDTO healthCampaignResponseDTO = healthCheckCampaignServiceImpl.updateCampaign(campaignId, healthCampaignRequestDTO);
        return ResponseEntity.ok(healthCampaignResponseDTO);
    }


    // Cập nhật trạng thái thành APPROVED của chiến dịch sức khỏe
    @PutMapping("/{campaignId}/approve")
    @PreAuthorize("hasRole('ADMIN') or hasRole('NURSE') or hasRole('PRINCIPAL')")
    public ResponseEntity<?> approveCampaign(@PathVariable int campaignId, Authentication authentication) {
        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();
        Integer approvedBy = userPrincipal.getId();
        HealthCampaignResponseDTO healthCampaignResponseDTO = healthCheckCampaignServiceImpl.approveCampaign(campaignId, approvedBy);
        return ResponseEntity.ok(healthCampaignResponseDTO);
    }

    // Cập nhật trạng thái của chiến dịch sức khỏe
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

    // Xem danh sách các chiến dịch đã được phê duyệt APRROVED dành cho phụ huynh
    @GetMapping("/approved")
    @PreAuthorize("hasRole('PARENT')")
    public ResponseEntity<?> getApprovedCampaign() {
        return ResponseEntity.ok(healthCheckCampaignServiceImpl.getApprovedCampaigns());
    }

    // Phụ huynh đăng ký cho học sinh tham gia chiến dịch sức khỏe
    // Tức là set trạng thái parentConfirmation = true và các trường khác sẽ được set mặc định
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

    // Cập nhật kết quả cho học sinh tham gia chiến dịch sức khỏe = PUT
    @PutMapping("/{healthcheckId}/update")
    @PreAuthorize("hasRole('PARENT') or hasRole('NURSE') or hasRole('ADMIN')")
    public ResponseEntity<?> updateStudentHealthCampaign(@PathVariable int healthcheckId, @RequestBody @Valid HealthCheckRequestDTO dto) {
        return ResponseEntity.ok(healthCheckCampaignServiceImpl.updateStudentHealthCampaign(healthcheckId,dto));
    }

    // phụ huynh xem chiến dịch mà học sinh đã đăng ký
    @GetMapping("/me/students/{studentId}/campaigns")
    @PreAuthorize("hasRole('PARENT')")
    public ResponseEntity<?> getMyChildHealthCampaigns(@PathVariable int studentId, Authentication authentication) {
        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();
        Integer userId = userPrincipal.getId();
        return ResponseEntity.ok(healthCheckCampaignServiceImpl.getMyChildHealthCampaigns(userId, studentId));
    }

    // ghi nhận kết quả sức khỏe của học sinh trong chiến dịch sức khỏe = POST
    @PostMapping("/result/{campaignId}")
    @PreAuthorize("hasRole('NURSE') or hasRole('ADMIN')")
    public ResponseEntity<?> recordHealthCheckResult(@PathVariable int campaignId, @RequestBody @Valid HealthCheckRequestDTO healthCheckRequestDTO) {
        return ResponseEntity.ok(healthCheckCampaignServiceImpl.recordHealthCheckResult(campaignId, healthCheckRequestDTO));
    }
}
