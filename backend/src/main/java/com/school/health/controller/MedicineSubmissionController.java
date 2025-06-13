package com.school.health.controller;


import com.school.health.dto.request.MedicineDetailRequest;
import com.school.health.dto.request.MedicineSubmissionRequest;
import com.school.health.dto.request.StatusUpdateRequest;
import com.school.health.dto.response.MedicineDetailResponse;
import com.school.health.dto.response.MedicineSubmissionResponse;
import com.school.health.entity.MedicineSubmission;
import com.school.health.security.services.UserDetailsImpl;
import com.school.health.service.MedicineSubmissionService;
import com.school.health.util.AuthenticationUtils;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

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
    @PostMapping
    @PreAuthorize("hasRole('PARENT')")
    public ResponseEntity<MedicineSubmissionResponse> createMedicineSubmission(@Valid @RequestBody MedicineSubmissionRequest medicineSubmissionRequest, Authentication authentication) {
        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();
        Integer userId = userPrincipal.getId();
        MedicineSubmissionResponse medicineSubmissionResponse = medicineSubmissionService.createMedicineSubmission(medicineSubmissionRequest, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(medicineSubmissionResponse);
    }

    //READ ALL - Phân quyền theo role
    @GetMapping
    @PreAuthorize("hasRole('PARENT') or hasRole('NURSE') or hasRole('ADMIN')")
    public ResponseEntity<List<MedicineSubmissionResponse>> getAllMedicineSubmissions(
            @RequestParam(required = false) Integer studentId,
            @RequestParam(required = false) Integer parentId,
            @RequestParam(required = false) String status,
            Authentication authentication) {

        List<MedicineSubmissionResponse> list;
        Integer userId = authUtils.getCurrentUserId(authentication);

        if (authUtils.hasRole(authentication, "PARENT")) {
            list = medicineSubmissionService.getAllByParent(userId, studentId, status);
        } else if (authUtils.hasRole(authentication, "NURSE")) {
            list = medicineSubmissionService.getAllForNurse(studentId, parentId, status);
        } else if (authUtils.hasRole(authentication, "ADMIN")) {
            list = medicineSubmissionService.getAllForAdmin(studentId, parentId, status);
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(list);
    }

    // READ ONE - Phân quyền theo role
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('PARENT') or hasRole('NURSE') or hasRole('ADMIN')")
    public ResponseEntity<MedicineSubmissionResponse> getMedicineSubmissionById(
            @PathVariable Integer id,
            Authentication authentication) {

        MedicineSubmissionResponse medicineSubmissionResponse = medicineSubmissionService.getById(id);
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

    
}
