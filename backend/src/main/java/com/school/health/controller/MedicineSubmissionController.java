package com.school.health.controller;


import com.school.health.dto.request.MedicineDetailRequest;
import com.school.health.dto.request.MedicineLogRequest;
import com.school.health.dto.request.MedicineSubmissionRequest;
import com.school.health.dto.request.StatusUpdateRequest;
import com.school.health.dto.response.*;
import com.school.health.entity.MedicineSubmission;
import com.school.health.security.services.UserDetailsImpl;
import com.school.health.service.MedicineSubmissionService;
import com.school.health.util.AuthenticationUtils;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/medicine-submissions")
@Validated
public class MedicineSubmissionController {

    @Autowired
    private MedicineSubmissionService medicineSubmissionService;

    @Autowired
    private AuthenticationUtils authUtils;

    //CREATE
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('PARENT')")
    public ResponseEntity<MedicineSubmissionResponse> createMedicineSubmission(
            @RequestParam("studentId") Integer studentId,
            @RequestParam("instruction") String instruction,
            @RequestParam("startDate") String startDate,
            @RequestParam("endDate") String endDate,
            @RequestParam("notes") String notes,
            @RequestPart("image") MultipartFile image,
            Authentication authentication
    ) {
        // Tạo request object từ các parameters
        MedicineSubmissionRequest request = new MedicineSubmissionRequest();
        request.setStudentId(studentId);
        request.setInstruction(instruction);
        request.setStartDate(LocalDate.parse(startDate));
        request.setEndDate(LocalDate.parse(endDate));
        request.setNotes(notes);

        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();
        Integer userId = userPrincipal.getId();
        MedicineSubmissionResponse medicineSubmissionResponse = medicineSubmissionService.createMedicineSubmission(request, image, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(medicineSubmissionResponse);
    }

//    //READ ALL - Phân quyền theo role
//    @GetMapping
//    @PreAuthorize("hasRole('PARENT') or hasRole('NURSE') or hasRole('ADMIN')")
//    public ResponseEntity<List<MedicineSubmissionResponse>> getAllMedicineSubmissions(
//            @RequestParam(required = false) Integer studentId,
//            @RequestParam(required = false) Integer parentId,
//            @RequestParam(required = false) String status,
//            Authentication authentication) {
//
//        List<MedicineSubmissionResponse> list;
//        Integer userId = authUtils.getCurrentUserId(authentication);
//
//        if (authUtils.hasRole(authentication, "PARENT")) {
//            list = medicineSubmissionService.getAllByParent(userId, studentId, status);
//        } else if (authUtils.hasRole(authentication, "NURSE")) {
//            list = medicineSubmissionService.getAllForNurse(studentId, parentId, status);
//        } else if (authUtils.hasRole(authentication, "ADMIN")) {
//            list = medicineSubmissionService.getAllForAdmin(studentId, parentId, status);
//        } else {
//            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
//        }
//
//        return ResponseEntity.ok(list);
//    }

    // Endpoint for PARENT to get their submissions
    @GetMapping("/parent")
    @PreAuthorize("hasRole('PARENT')")
    public ResponseEntity<List<MedicineSubmissionResponse>> getSubmissionsForParent(
            @RequestParam(required = false) Integer studentId,
            @RequestParam(required = false) String status,
            Authentication authentication) {
        Integer parentId = authUtils.getCurrentUserId(authentication);
        List<MedicineSubmissionResponse> list = medicineSubmissionService.getAllByParent(parentId, studentId, status);
        return ResponseEntity.ok(list);
    }

    // Endpoint for NURSE to get submissions
    @GetMapping("/nurse")
    @PreAuthorize("hasRole('NURSE')")
    public ResponseEntity<List<MedicineSubmissionResponse>> getSubmissionsForNurse(
            @RequestParam(required = false) Integer studentId,
            @RequestParam(required = false) Integer parentId,
            @RequestParam(required = false) String status) {
        List<MedicineSubmissionResponse> list = medicineSubmissionService.getAllForNurse(studentId, parentId, status);
        return ResponseEntity.ok(list);
    }

    // Endpoint for ADMIN to get submissions
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<MedicineSubmissionResponse>> getSubmissionsForAdmin(
            @RequestParam(required = false) Integer studentId,
            @RequestParam(required = false) Integer parentId,
            @RequestParam(required = false) String status) {
        List<MedicineSubmissionResponse> list = medicineSubmissionService.getAllForAdmin(studentId, parentId, status);
        return ResponseEntity.ok(list);
    }

    // READ ONE - Phân quyền theo role
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('PARENT') or hasRole('NURSE') or hasRole('ADMIN')")
    public ResponseEntity<MedicineSubmissionResponse> getMedicineSubmissionById(
            @PathVariable Integer id,
            Authentication authentication) {

        boolean includeLogsData = authUtils.hasRole(authentication, "NURSE") || authUtils.hasRole(authentication, "PARENT");
        MedicineSubmissionResponse medicineSubmissionResponse;

        if (includeLogsData) {
            medicineSubmissionResponse = medicineSubmissionService.getByIdForNurse(id);
        } else {
            medicineSubmissionResponse = medicineSubmissionService.getById(id);
        }


        Integer currentUserId = authUtils.getCurrentUserId(authentication);

        // Kiểm tra quyền truy cập
        if (authUtils.hasRole(authentication, "PARENT")) {
            authUtils.checkOwnership(currentUserId, medicineSubmissionResponse.getParentId(), "medicine submission");
        }

        return ResponseEntity.ok(medicineSubmissionResponse);
    }

    // UPDATE STATUS - ONLY NURSE CAN UPDATE
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('NURSE')")
    public ResponseEntity<MedicineSubmissionResponse> updateMedicineSubmissionStatus(
            @PathVariable Integer id,
            @Valid @RequestBody StatusUpdateRequest request,
            Authentication authentication) {

        Integer approvedBy = authUtils.getCurrentUserId(authentication);
        request.setApprovedBy(approvedBy);
        request.setApprovedAt(LocalDate.now());

        MedicineSubmissionResponse updatedResponse = medicineSubmissionService.updateStatus(id, request);
        return ResponseEntity.ok(updatedResponse);
    }

    // DELETE - PARENT xóa đơn PENDING, NURSE xóa ALL
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('PARENT') or hasRole('NURSE')")
    public ResponseEntity<Void> deleteMedicineSubmission(
            @PathVariable Integer id,
            Authentication authentication) {

        Integer currentUserId = authUtils.getCurrentUserId(authentication);

        if (authUtils.hasRole(authentication, "PARENT")) {
            medicineSubmissionService.deleteByParent(id, currentUserId);
        } else if (authUtils.hasRole(authentication, "NURSE")) {
            // NURSE can delete any submission
            medicineSubmissionService.delete(id);
        }

        return ResponseEntity.noContent().build();
    }

    // API cho PARENT - Danh sách con
    @GetMapping("/my-children")
    @PreAuthorize("hasRole('PARENT')")
    public ResponseEntity<List<StudentSummaryResponse>> getChildrenByParent(Authentication authentication) {
        Integer parentId = authUtils.getCurrentUserId(authentication);
        List<StudentSummaryResponse> childrenList = medicineSubmissionService.getChildrenByParent(parentId);
        return ResponseEntity.ok(childrenList);
    }

    // API cho ADMIN - Dashboard
    @GetMapping("/admin/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminDashboardResponse> getAdminDashboard() {
        AdminDashboardResponse dashboard = medicineSubmissionService.getAdminDashboard();
        return ResponseEntity.ok(dashboard);
    }

    // API cho NURSE - Dashboard
    @GetMapping("/nurse/dashboard")
    @PreAuthorize("hasRole('NURSE')")
    public ResponseEntity<HealthDashboardResponse> getNurseDashboard() {
        HealthDashboardResponse dashboard = medicineSubmissionService.getHealthDashboard();
        return ResponseEntity.ok(dashboard);
    }

    // API chấm công uống thuốc - NURSE
    @PostMapping("/{id}/mark-taken")
    @PreAuthorize("hasAnyRole('NURSE')")
    public ResponseEntity<MedicineLogResponse> markMedicineTaken(
            @PathVariable Integer id,
            @Valid @RequestBody MedicineLogRequest request,
            Authentication authentication) {

         Integer givenBy = authUtils.getCurrentUserId(authentication);
        request.setGivenByUserId(givenBy);
        request.setGivenAt(LocalDate.now());

        MedicineLogResponse response = medicineSubmissionService.markMedicineTaken(id, request);
        return ResponseEntity.status(201).body(response);
    }


}
