package com.school.health.controller;

import com.school.health.dto.request.HealthCheckRequestDTO;
import com.school.health.dto.request.VaccinationCampaignRequestDTO;
import com.school.health.dto.request.VaccinationRequestDTO;
import com.school.health.enums.Status;
import com.school.health.security.services.UserDetailsImpl;
import com.school.health.service.impl.VaccinationCampaignServiceImpl;
import jakarta.validation.Valid;
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
    private final VaccinationCampaignServiceImpl vaccinationCampaignServiceImpl;

    // Tạo chiến dịch tiêm chủng
    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('NURSE')")
    public ResponseEntity<?> createVaccinationCampaign(@RequestBody @Valid VaccinationCampaignRequestDTO vaccine, Authentication authentication) {
        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();
        Integer userId = userPrincipal.getId();
        return ResponseEntity.ok(vaccinationCampaignService.createVaccinationCampaign(vaccine, userId));
    }

    // Lấy tất cả danh sách chiến dịch tiêm chủng
    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('NURSE')")
    public ResponseEntity<?> getAllVaccinationCampaigns() {
        return ResponseEntity.ok(vaccinationCampaignService.getAllVaccinationCampaigns());
    }

    // Lấy danh sách chiến dịch tiêm chủng đã được phê duyệt theo ID
    @GetMapping("/{campaignId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('NURSE')")
    public ResponseEntity<?> getVaccinationCampaignById(@PathVariable @Valid int campaignId) {
        return ResponseEntity.ok(vaccinationCampaignService.getVaccinationCampaignById(campaignId));
    }


    // Cập nhật thông tin chiến dịch tiêm chủng theo ID
    @PutMapping("/{campaignId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('NURSE')")
    public ResponseEntity<?> updateVaccinationCampaign(@PathVariable @Valid int campaignId, @RequestBody @Valid VaccinationCampaignRequestDTO vaccine) {
        return ResponseEntity.ok(vaccinationCampaignService.updateVaccinationCampaign(campaignId, vaccine));
    }

    // Cập nhật trạng thái thành APPROVED của chiến dịch tiêm chủng
    @PutMapping("/{campaignId}/approve")
//    @PreAuthorize("hasRole('ADMIN') or hasRole('NURSE')")
    public ResponseEntity<?> approveVaccinationCampaign(@PathVariable @Valid int campaignId, Authentication authentication) {
        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();
        Integer approvedBy = userPrincipal.getId();
        return ResponseEntity.ok(vaccinationCampaignService.approveVaccinationCampaign(campaignId, approvedBy));
    }


    // Cập nhật trạng thái của chiến dịch tiêm chủng
    @PutMapping("/{campaignId}/status/{status}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('NURSE')")
    public ResponseEntity<?> updateVaccinationCampaignStatus(@PathVariable @Valid int campaignId, @PathVariable @Valid Status status) {
        return ResponseEntity.ok(vaccinationCampaignService.updateVaccinationCampaignStatus(campaignId, status));
    }

    // danh sách học sinh đã đăng ký tiêm chủng trong chiến dịch
    @GetMapping("/{campaignId}/students-registrations")
    @PreAuthorize("hasRole('ADMIN') or hasRole('NURSE')")
    public ResponseEntity<?> getStudentsRegistrationsInCampaign(@PathVariable @Valid int campaignId) {
        return ResponseEntity.ok(vaccinationCampaignService.getStudentsRegistrations(campaignId));
    }

    // Lấy danh sách chiến dịch tiêm chủng đã được phê duyệt
    @GetMapping("/approved")
    @PreAuthorize("hasRole('PARENT') or hasRole('NURSE')")
    public ResponseEntity<?> getApprovedVaccinationCampaigns() {
        return ResponseEntity.ok(vaccinationCampaignService.getApprovedVaccination());
    }

    // Đăng ký học sinh tham gia chiến dịch tiêm chủng. Tức là phụ huynh sẽ đăng ký cho con mình tham gia chiến dịch tiêm chủng
    // cập nhật parentconfirmation thành true còn các trường khác sẽ được set mặc định
    @PostMapping("/{campaignId}/student/{studentId}/register")
    @PreAuthorize("hasRole('PARENT') or hasRole('NURSE') or hasRole('ADMIN')")
    public ResponseEntity<?> registerStudentForVaccinationCampaign(@PathVariable @Valid int campaignId, @PathVariable @Valid int studentId) {
        {
            VaccinationRequestDTO request = new VaccinationRequestDTO();
            request.setCampaignId(campaignId);
            request.setStudentId(studentId);
            return ResponseEntity.ok(vaccinationCampaignService.registerStudentVaccine(request));
        }
    }

    // Phụ huynh lấy danh sách chiến dịch tiêm chủng của con mình
    @GetMapping("/me/students/{studentId}/campaigns")
    @PreAuthorize("hasRole('PARENT')")
    public ResponseEntity<?> getMyChildHealthCampaigns(@PathVariable @Valid int studentId, Authentication authentication) {
        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();
        Integer userId = userPrincipal.getId();
        return ResponseEntity.ok(vaccinationCampaignService.getMyChildHealthCampaigns(userId, studentId));
    }


    // Post kết quả tiêm chủng cho học sinh trong chiến dịch
    @PostMapping("result/{campaignId}")
    @PreAuthorize("hasRole('NURSE') or hasRole('ADMIN')")
    public ResponseEntity<?> recordVaccination(@PathVariable @Valid int campaignId, @RequestBody @Valid VaccinationRequestDTO request) {
        return ResponseEntity.ok(vaccinationCampaignService.recordVaccinationResult(campaignId, request));
    }

    // Cập nhật kết quả tiêm chủng cho học sinh trong chiến dịch
    @PutMapping("/{vaccinecheckId}/update")
    @PreAuthorize("hasRole('PARENT') or hasRole('NURSE') or hasRole('ADMIN')")
    public ResponseEntity<?> updateStudentHealthCampaign(@PathVariable @Valid int vaccinecheckId, @RequestBody @Valid VaccinationRequestDTO dto) {
        return ResponseEntity.ok(vaccinationCampaignService.updateStudentVaccinationCampaign(vaccinecheckId, dto));
    }

    // Lấy kết quả của tất cả học sinh trong chiến dịch sức khỏe
    @GetMapping("/{campaignId}/results")
    @PreAuthorize("hasRole('NURSE') or hasRole('ADMIN')")
    public ResponseEntity<?> getVaccinationResults(@PathVariable @Valid int campaignId) {
        return ResponseEntity.ok(vaccinationCampaignService.getVaccinationResults(campaignId));
    }

    // lấy tất cả kết quả của chiến dịch sức khỏe
    @GetMapping("/results-campaign/all")
    @PreAuthorize("hasRole('NURSE') or hasRole('ADMIN')")
    public ResponseEntity<?> getAllVaccinationResults() {
        return ResponseEntity.ok(vaccinationCampaignService.getAllVaccinationResults());
    }

    @GetMapping("/results-campaign/student/{studentId}")
    @PreAuthorize("hasRole('PARENT') or hasRole('ADMIN')")
    public ResponseEntity<?> getResultByStudentId(@PathVariable @Valid int studentId) {
        return ResponseEntity.ok(vaccinationCampaignService.getResultByStudentId(studentId));
    }
}
