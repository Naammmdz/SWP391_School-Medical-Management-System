package com.school.health.controller;

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

import java.time.LocalDate;

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
    @PreAuthorize("hasRole('PARENT') or hasRole('ADMIN') or hasRole('NURSE')")
    public ResponseEntity<?> createVaccinationCampaign(@RequestBody @Valid VaccinationCampaignRequestDTO vaccine, Authentication authentication) {
        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();
        Integer userId = userPrincipal.getId();
        return ResponseEntity.ok(vaccinationCampaignService.createVaccinationCampaign(vaccine, userId));
    }

    // Lấy tất cả danh sách chiến dịch tiêm chủng
    @GetMapping
    @PreAuthorize("hasRole('PARENT') or hasRole('ADMIN') or hasRole('NURSE')")
    public ResponseEntity<?> getAllVaccinationCampaigns() {
        return ResponseEntity.ok(vaccinationCampaignService.getAllVaccinationCampaigns());
    }

    // Lấy danh sách chiến dịch tiêm chủng đã được phê duyệt theo ID
    @GetMapping("/{campaignId}")
    @PreAuthorize("hasRole('PARENT') or hasRole('ADMIN') or hasRole('NURSE')")
    public ResponseEntity<?> getVaccinationCampaignById(@PathVariable @Valid int campaignId) {
        return ResponseEntity.ok(vaccinationCampaignService.getVaccinationCampaignById(campaignId));
    }


    // Cập nhật thông tin chiến dịch tiêm chủng theo ID
    @PutMapping("/{campaignId}")
    @PreAuthorize("hasRole('PARENT') or hasRole('ADMIN') or hasRole('NURSE')")
    public ResponseEntity<?> updateVaccinationCampaign(@PathVariable @Valid int campaignId, @RequestBody @Valid VaccinationCampaignRequestDTO vaccine) {
        return ResponseEntity.ok(vaccinationCampaignService.updateVaccinationCampaign(campaignId, vaccine));
    }

    // Cập nhật trạng thái thành APPROVED của chiến dịch tiêm chủng
    @PutMapping("/{campaignId}/approve")
    @PreAuthorize("hasRole('PARENT') or hasRole('ADMIN') or hasRole('NURSE')")
    public ResponseEntity<?> approveVaccinationCampaign(@PathVariable @Valid int campaignId, Authentication authentication) {
        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();
        Integer approvedBy = userPrincipal.getId();
        return ResponseEntity.ok(vaccinationCampaignService.approveVaccinationCampaign(campaignId, approvedBy, Status.APPROVED, null));
    }

    // Cập nhật trạng thái thành CANCELLED của chiến dịch tiêm chủng
    @PutMapping("/{campaignId}/cancel")
    @PreAuthorize("hasRole('PARENT') or hasRole('ADMIN') or hasRole('NURSE')")
    public ResponseEntity<?> cancelVaccinationCampaign(@PathVariable @Valid int campaignId, Authentication authentication, @RequestParam(required = false) String rejectionReason) {
        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();
        Integer cancelledBy = userPrincipal.getId();
        return ResponseEntity.ok(vaccinationCampaignService.approveVaccinationCampaign(campaignId, cancelledBy, Status.CANCELLED, rejectionReason));
    }



    // Cập nhật trạng thái của chiến dịch tiêm chủng
    @PutMapping("/{campaignId}/status/{status}")
    @PreAuthorize("hasRole('PARENT') or hasRole('ADMIN') or hasRole('NURSE')")
    public ResponseEntity<?> updateVaccinationCampaignStatus(@PathVariable @Valid int campaignId, @PathVariable @Valid Status status) {
        return ResponseEntity.ok(vaccinationCampaignService.updateVaccinationCampaignStatus(campaignId, status));
    }

    // danh sách học sinh đã đăng ký tiêm chủng trong chiến dịch
    @GetMapping("/{campaignId}/students-registrations")
    @PreAuthorize("hasRole('PARENT') or hasRole('ADMIN') or hasRole('NURSE')")
    public ResponseEntity<?> getStudentsRegistrationsInCampaign(@PathVariable @Valid int campaignId) {
        return ResponseEntity.ok(vaccinationCampaignService.getStudentsRegistrations(campaignId));
    }

    // Lấy danh sách chiến dịch tiêm chủng đã được phê duyệt
    @GetMapping("/approved")
    @PreAuthorize("hasRole('PARENT') or hasRole('ADMIN') or hasRole('NURSE')")
    public ResponseEntity<?> getApprovedVaccinationCampaigns(Authentication authentication) {
        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();
        Integer userId = userPrincipal.getId();
        return ResponseEntity.ok(vaccinationCampaignService.getApprovedCampaigns(userId));
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

    @PostMapping("/{campaignId}/student/{studentId}/reject")
    @PreAuthorize("hasRole('PARENT') or hasRole('NURSE') or hasRole('ADMIN')")
    public ResponseEntity<?> rejectStudentForVaccinationCampaign(@PathVariable @Valid int campaignId, @PathVariable @Valid int studentId) {
        VaccinationRequestDTO request = new VaccinationRequestDTO();
        request.setCampaignId(campaignId);
        request.setStudentId(studentId);
        return ResponseEntity.ok(vaccinationCampaignService.rejectStudentVaccine(request));
    }

    // Phụ huynh lấy danh sách chiến dịch tiêm chủng của con mình
    @GetMapping("/me/students/{studentId}/campaigns")
    @PreAuthorize("hasRole('PARENT') or hasRole('ADMIN') or hasRole('NURSE')")
    public ResponseEntity<?> getMyChildHealthCampaigns(@PathVariable @Valid int studentId, Authentication authentication) {
        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();
        Integer userId = userPrincipal.getId();
        return ResponseEntity.ok(vaccinationCampaignService.getMyChildHealthCampaigns(userId, studentId));
    }


    // Post kết quả tiêm chủng cho học sinh trong chiến dịch
    @PostMapping("result/{campaignId}")
    @PreAuthorize("hasRole('PARENT') or hasRole('ADMIN') or hasRole('NURSE')")
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
    @PreAuthorize("hasRole('PARENT') or hasRole('ADMIN') or hasRole('NURSE')")
    public ResponseEntity<?> getVaccinationResults(@PathVariable @Valid int campaignId) {
        return ResponseEntity.ok(vaccinationCampaignService.getVaccinationResults(campaignId));
    }

    // lấy tất cả kết quả của chiến dịch sức khỏe
    @GetMapping("/results-campaign/all")
    @PreAuthorize("hasRole('PARENT') or hasRole('ADMIN') or hasRole('NURSE')")
    public ResponseEntity<?> getAllVaccinationResults() {
        return ResponseEntity.ok(vaccinationCampaignService.getAllVaccinationResults());
    }

    @GetMapping("/results-campaign/student/{studentId}")
    @PreAuthorize("hasRole('PARENT') or hasRole('ADMIN') or hasRole('NURSE')")
    public ResponseEntity<?> getResultByStudentId(@PathVariable @Valid int studentId) {
        return ResponseEntity.ok(vaccinationCampaignService.getResultByStudentId(studentId));
    }

//    @GetMapping("/filter/result")
//    @PreAuthorize("hasRole('PARENT') or hasRole('ADMIN') or hasRole('NURSE')")
//    public ResponseEntity<?> getResultWithFilter(@RequestParam(required = false) LocalDate startDate, @RequestParam(required = false) LocalDate endDate) {
//        if (startDate != null && endDate != null) {
//            if (startDate.isAfter(endDate)) {
//                throw new RuntimeException("startDate is after endDate");
//            }
//        }
//        return ResponseEntity.ok(vaccinationCampaignService.getResultWithFilterDate(startDate, endDate));
//    }

    @GetMapping("/student/{studentId}/campaign-parentConfirmation/{parentConfirmation}")
    @PreAuthorize("hasRole('PARENT') or hasRole('NURSE') or hasRole('ADMIN')")
    public ResponseEntity<?> getCampaignStatus(@PathVariable @Valid int studentId, @PathVariable boolean parentConfirmation) {
        return ResponseEntity.ok(vaccinationCampaignService.getCampaignStatus(studentId, parentConfirmation));
    }


    @GetMapping("/filter-result")
    @PreAuthorize("hasRole('PARENT') or hasRole('ADMIN') or hasRole('NURSE')")
    public ResponseEntity<?> filterVaccinationCampaigns(
            @RequestParam(required = false) String className,
            @RequestParam(required = false) String campaignName,
            @RequestParam(required = false) String studentName,
            @RequestParam(required = false) Boolean parentConfirmation,
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate
    ) {
        return ResponseEntity.ok(vaccinationCampaignService.filterVaccinationCampaigns(className, campaignName, studentName, parentConfirmation, startDate, endDate));
    }

//    // Get all vaccination results with parent confirmation is true
//    @GetMapping("/results-campaign/parent-confirmation-true")
//    @PreAuthorize("hasRole('PARENT') or hasRole('ADMIN') or hasRole('NURSE')")
//    public ResponseEntity<?> getAllVaccinationResultsWithParentConfirmationTrue() {
//        return ResponseEntity.ok(vaccinationCampaignService.getAllVaccinationResultsWithParentConfirmationTrue());
//    }

    // danh sách tất cả học sinh có thể tham gia chiến dịch (theo target group)
    @GetMapping("/{campaignId}/all-students")
    @PreAuthorize("hasRole('PARENT') or hasRole('ADMIN') or hasRole('NURSE')")
    public ResponseEntity<?> getAllStudentsInCampaign(@PathVariable @Valid int campaignId) {
        return ResponseEntity.ok(vaccinationCampaignService.getAllStudentsInCampaign(campaignId));
    }

    // danh sách tất cả học sinh với trạng thái tiêm chủng
    @GetMapping("/{campaignId}/students-with-status")
    @PreAuthorize("hasRole('PARENT') or hasRole('ADMIN') or hasRole('NURSE')")
    public ResponseEntity<?> getStudentsWithVaccinationStatus(@PathVariable @Valid int campaignId) {
        return ResponseEntity.ok(vaccinationCampaignService.getStudentsWithVaccinationStatus(campaignId));
    }

}
