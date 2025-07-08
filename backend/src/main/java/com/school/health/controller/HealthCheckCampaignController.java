package com.school.health.controller;

import com.school.health.dto.request.HealthCampaignRequestDTO;
import com.school.health.dto.request.HealthCheckRequestDTO;
import com.school.health.dto.response.HealthCampaignResponseDTO;
import com.school.health.enums.Status;
import com.school.health.security.services.UserDetailsImpl;
import com.school.health.service.HealthCheckCampaignService;
import com.school.health.service.impl.HealthCheckCampaignServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RequestMapping("/api/healthcheck-campaigns")
@RestController
@Validated

@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600) // Cho phép React frontend gọi API
public class HealthCheckCampaignController {
    private final HealthCheckCampaignServiceImpl healthCheckCampaignServiceImpl;
    private final HealthCheckCampaignService healthCheckCampaignService;

    // tạo chiến dịch sức khỏe
    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('NURSE') or hasRole('PRINCIPAL') or hasRole('PARENT')")
    public ResponseEntity<?> createCampaign(@Valid @RequestBody HealthCampaignRequestDTO healthCampaignRequestDTO, Authentication authentication) {
        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();
        Integer userId = userPrincipal.getId();
        HealthCampaignResponseDTO healthCampaignResponseDTO = healthCheckCampaignServiceImpl.createCampaign(healthCampaignRequestDTO, userId);
        return ResponseEntity.ok(healthCampaignResponseDTO);
    }

    // lấy full danh sách chiến dịch sức khỏe
    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('NURSE') or hasRole('PRINCIPAL') or hasRole('PARENT')")
    public ResponseEntity<?> getAllCampaigns() {
        return ResponseEntity.ok(healthCheckCampaignServiceImpl.getAllCampaigns());
    }

    // lấy danh sách chiến dịch sức khỏe theo id
    @GetMapping("/{campaignId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('NURSE') or hasRole('PRINCIPAL') or hasRole('PARENT')")
    public ResponseEntity<?> getCampaignById(@PathVariable @Valid int campaignId) {
        return ResponseEntity.ok(healthCheckCampaignServiceImpl.getCampaignById(campaignId));
    }


    // Cập nhật thông tin chiến dịch sức khỏe theo ID
    @PutMapping("/{campaignId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('NURSE') or hasRole('PRINCIPAL') or hasRole('PARENT')")
    public ResponseEntity<?> updateCampaign(@PathVariable @Valid int campaignId, @RequestBody @Valid HealthCampaignRequestDTO healthCampaignRequestDTO) {
        HealthCampaignResponseDTO healthCampaignResponseDTO = healthCheckCampaignServiceImpl.updateCampaign(campaignId, healthCampaignRequestDTO);
        return ResponseEntity.ok(healthCampaignResponseDTO);
    }


    // Cập nhật trạng thái thành APPROVED của chiến dịch sức khỏe
    @PutMapping("/{campaignId}/approve")
    @PreAuthorize("hasRole('ADMIN') or hasRole('NURSE') or hasRole('PRINCIPAL') or hasRole('PARENT')")
    public ResponseEntity<?> approveCampaign(@PathVariable @Valid int campaignId, Authentication authentication) {
        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();
        Integer approvedBy = userPrincipal.getId();
        HealthCampaignResponseDTO healthCampaignResponseDTO = healthCheckCampaignServiceImpl.approveCampaign(campaignId, approvedBy, Status.APPROVED, null);
        return ResponseEntity.ok(healthCampaignResponseDTO);
    }

    // Cập nhật trạng thái thành REJECTED của chiến dịch sức khỏe
    @PutMapping("/{campaignId}/reject")
    @PreAuthorize("hasRole('ADMIN') or hasRole('NURSE') or hasRole('PRINCIPAL') or hasRole('PARENT')")
    public ResponseEntity<?> rejectCampaign(@PathVariable @Valid int campaignId, Authentication authentication, @RequestParam(required = false) String rejectionReason) {
        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();
        Integer approvedBy = userPrincipal.getId();
        HealthCampaignResponseDTO healthCampaignResponseDTO = healthCheckCampaignServiceImpl.approveCampaign(campaignId, approvedBy, Status.CANCELLED, rejectionReason);
        return ResponseEntity.ok(healthCampaignResponseDTO);
    }

    // Cập nhật trạng thái của chiến dịch sức khỏe
    @PutMapping("/{campaignId}/status/{status}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('NURSE') or hasRole('PRINCIPAL') or hasRole('PARENT')")
    public ResponseEntity<?> updateCampaignStatus(@PathVariable @Valid int campaignId, @PathVariable @Valid Status status) {
        HealthCampaignResponseDTO healthCampaignResponseDTO = healthCheckCampaignServiceImpl.updateCampaignStatus(campaignId, status);
        return ResponseEntity.ok(healthCampaignResponseDTO);
    }

    // Endpoint để lấy danh sách đăng ký của học sinh trong chiến dịch sức khỏe
    // Tức là danh sách học sinh đã được parentConfirmation với bit status = true
    @GetMapping("{campaignId}/students-registrations")
    @PreAuthorize("hasRole('ADMIN') or hasRole('NURSE') or hasRole('PRINCIPAL') or hasRole('PARENT')")
    public ResponseEntity<?> getStudentsRegistrations(@PathVariable @Valid int campaignId) {
        return ResponseEntity.ok(healthCheckCampaignServiceImpl.getStudentsRegistrations(campaignId));
    }

    // Xem danh sách các chiến dịch đã được phê duyệt APRROVED dành cho phụ huynh
    @GetMapping("/approved")
    @PreAuthorize("hasRole('ADMIN') or hasRole('NURSE') or hasRole('PRINCIPAL') or hasRole('PARENT')")
    public ResponseEntity<?> getApprovedCampaign(Authentication authentication) {
        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();
        Integer userId = userPrincipal.getId();
        return ResponseEntity.ok(healthCheckCampaignServiceImpl.getApprovedCampaigns(userId));
    }

    // Phụ huynh đăng ký cho học sinh tham gia chiến dịch sức khỏe
    // Tức là set trạng thái parentConfirmation = true và các trường khác sẽ được set mặc định
    @PostMapping("/{campaignId}/student/{studentId}/register")
    @PreAuthorize("hasRole('ADMIN') or hasRole('NURSE') or hasRole('PRINCIPAL') or hasRole('PARENT')")
    public ResponseEntity<?> registerStudentForHealthCampaign(@PathVariable @Valid int campaignId, @PathVariable @Valid int studentId, Authentication authentication) {
        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();
        Integer userId = userPrincipal.getId();
        HealthCheckRequestDTO dto = new HealthCheckRequestDTO();
        dto.setCampaignId(campaignId);
        dto.setStudentId(studentId);
        return ResponseEntity.ok(healthCheckCampaignServiceImpl.registerStudentHealthCheck(dto));
    }

    // Phụ huynh từ chối đăng ký cho học sinh tham gia chiến dịch sức khỏe
    @PostMapping("/{campaignId}/student/{studentId}/reject")
    @PreAuthorize("hasRole('ADMIN') or hasRole('NURSE') or hasRole('PRINCIPAL') or hasRole('PARENT')")

    public ResponseEntity<?> rejectStudentForHealthCampaign(@PathVariable @Valid int campaignId, @PathVariable @Valid int studentId) {

        HealthCheckRequestDTO dto = new HealthCheckRequestDTO();
        dto.setCampaignId(campaignId);
        dto.setStudentId(studentId);
        return ResponseEntity.ok(healthCheckCampaignServiceImpl.rejectStudentVaccine(dto));
    }

    // Cập nhật kết quả cho học sinh tham gia chiến dịch sức khỏe = PUT
    @PutMapping("/{healthcheckId}/update")
    @PreAuthorize("hasRole('ADMIN') or hasRole('NURSE') or hasRole('PRINCIPAL') or hasRole('PARENT')")
    public ResponseEntity<?> updateStudentHealthCampaign(@PathVariable @Valid int healthcheckId, @RequestBody @Valid HealthCheckRequestDTO dto) {
        return ResponseEntity.ok(healthCheckCampaignServiceImpl.updateStudentHealthCampaign(healthcheckId, dto));
    }

    // phụ huynh xem chiến dịch mà học sinh đã đăng ký
    @GetMapping("/me/students/{studentId}/campaigns")
    @PreAuthorize("hasRole('ADMIN') or hasRole('NURSE') or hasRole('PRINCIPAL') or hasRole('PARENT')")
    public ResponseEntity<?> getMyChildHealthCampaigns(@PathVariable @Valid int studentId, Authentication authentication) {
        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();
        Integer userId = userPrincipal.getId();
        return ResponseEntity.ok(healthCheckCampaignServiceImpl.getMyChildHealthCampaigns(userId, studentId));
    }

    // ghi nhận kết quả sức khỏe của học sinh trong chiến dịch sức khỏe = POST
    @PostMapping("/result/{campaignId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('NURSE') or hasRole('PRINCIPAL') or hasRole('PARENT')")
    public ResponseEntity<?> recordHealthCheckResult(@PathVariable @Valid int campaignId, @RequestBody @Valid HealthCheckRequestDTO healthCheckRequestDTO) {
        return ResponseEntity.ok(healthCheckCampaignServiceImpl.recordHealthCheckResult(campaignId, healthCheckRequestDTO));
    }

    // Lấy kết quả của tất cả học sinh trong chiến dịch sức khỏe
    @GetMapping("/{campaignId}/results")
    @PreAuthorize("hasRole('ADMIN') or hasRole('NURSE') or hasRole('PRINCIPAL') or hasRole('PARENT')")
    public ResponseEntity<?> getHealthCheckResults(@PathVariable @Valid int campaignId) {
        return ResponseEntity.ok(healthCheckCampaignServiceImpl.getHealthCheckResults(campaignId));
    }

    // lấy tất cả kết quả của chiến dịch sức khỏe
    @GetMapping("/results-campaign/all")
    @PreAuthorize("hasRole('ADMIN') or hasRole('NURSE') or hasRole('PRINCIPAL') or hasRole('PARENT')")
    public ResponseEntity<?> getAllHealthCheckResults() {
        return ResponseEntity.ok(healthCheckCampaignServiceImpl.getAllHealthCheckResults());
    }

    // lấy kết quả chiến dịch bằng studentid
    @GetMapping("/results-campaign/student/{studentId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('NURSE') or hasRole('PRINCIPAL') or hasRole('PARENT')")
    public ResponseEntity<?> getResultByStudentId(@PathVariable @Valid int studentId) {
        return ResponseEntity.ok(healthCheckCampaignServiceImpl.getResultByStudentId(studentId));
    }

//    @GetMapping("/filter/result")
//    @PreAuthorize("hasRole('ADMIN') or hasRole('NURSE') or hasRole('PRINCIPAL') or hasRole('PARENT')")
//    public ResponseEntity<?> getResultWithFilter(@RequestParam(required = false) LocalDate startDate, @RequestParam(required = false) LocalDate endDate, @RequestParam(required = false) boolean consultationAppointment) {
//        if (startDate != null && endDate != null) {
//            if (startDate.isAfter(endDate)) {
//                throw new RuntimeException("startDate is after endDate");
//            }
//        }
//        return ResponseEntity.ok(healthCheckCampaignService.getResultWithFilterDate(startDate, endDate, consultationAppointment));
//    }

    // lấy trạng thái của chiến dịch sức khỏe từ parentConfirm trong kết quả chiến dịch
    @GetMapping("/student/{studentId}/campaign-parentConfirmation/{parentConfirmation}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('NURSE') or hasRole('PRINCIPAL') or hasRole('PARENT')")
    public ResponseEntity<?> getCampaignStatus(@PathVariable @Valid int studentId, @PathVariable(required = false) @Valid boolean parentConfirmation) {
        return ResponseEntity.ok(healthCheckCampaignService.getCampaignStatus(studentId, parentConfirmation));
    }

    // Phụ huynh xem các chiến dịch là đồng ý hay từ chối
    @GetMapping("/student/{studentId}/campaigns-isAcceptOrReject")
    @PreAuthorize("hasRole('ADMIN') or hasRole('NURSE') or hasRole('PRINCIPAL') or hasRole('PARENT')")
    public ResponseEntity<?> getCampaignsIsAcceptOrReject(@PathVariable @Valid int studentId) {
        return ResponseEntity.ok(healthCheckCampaignService.getCampaignsIsAcceptOrReject(studentId));
    }

    // filter kết quả kiểm tra chiến dịch theo lớp, tên chiến dịch và tên học sinh
    @GetMapping("/filter-result")
    @PreAuthorize("hasRole('ADMIN') or hasRole('NURSE') or hasRole('PRINCIPAL') or hasRole('PARENT')")
    public ResponseEntity<?> filterHealthCheckCampaigns(
            @RequestParam(required = false) String className,
            @RequestParam(required = false) String campaignName,
            @RequestParam(required = false) String studentName,
            @RequestParam(required = false) Boolean isParentConfirmation,
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate
    ) {
        if(startDate != null && endDate != null) {
            if (startDate.isAfter(endDate)) {
                throw new RuntimeException("startDate is after endDate");
            }
        }
        return ResponseEntity.ok(healthCheckCampaignService.filterHealthCheckCampaigns(className, campaignName, studentName, isParentConfirmation, startDate, endDate));
    }

//    // Get all health check results with parent confirmation is true
//    @GetMapping("/results-campaign/all/confirmation-true")
//    @PreAuthorize("hasRole('ADMIN') or hasRole('NURSE') or hasRole('PRINCIPAL') or hasRole('PARENT')")
//    public ResponseEntity<?> getAllHealthCheckResultsWithParentConfirmationTrue() {
//        return ResponseEntity.ok(healthCheckCampaignServiceImpl.getAllHealthCheckResultsWithParentConfirmationTrue());
//    }


}
