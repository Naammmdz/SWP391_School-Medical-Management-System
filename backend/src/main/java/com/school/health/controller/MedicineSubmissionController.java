package com.school.health.controller;


import com.school.health.dto.request.MedicineDetailRequest;
import com.school.health.dto.request.MedicineSubmissionRequest;
import com.school.health.dto.response.MedicineDetailResponse;
import com.school.health.dto.response.MedicineSubmissionResponse;
import com.school.health.entity.MedicineSubmission;
import com.school.health.security.services.UserDetailsImpl;
import com.school.health.service.MedicineSubmissionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/medicine-submissions")
@Validated
public class MedicineSubmissionController {

    @Autowired
    private MedicineSubmissionService medicineSubmissionService;

    //CREATE
    @PostMapping
    @PreAuthorize("hasRole('PARENT')")
    public ResponseEntity<MedicineSubmissionResponse> createMedicineSubmission(@Valid @RequestBody MedicineSubmissionRequest medicineSubmissionRequest, Authentication authentication) {
        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();
        Integer userId = userPrincipal.getId();
        MedicineSubmissionResponse medicineSubmissionResponse = medicineSubmissionService.createMedicineSubmission(medicineSubmissionRequest, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(medicineSubmissionResponse);
    }

    //READ ALL
    @GetMapping
    @PreAuthorize("hasAnyRole('PARENT', 'ADMIN', 'HEALTH_STAFF')")
    public ResponseEntity<List<MedicineSubmissionResponse>> getAllMedicineSubmissions(
            Authentication authentication,
            @RequestParam(required = false) Integer studentId,
            @RequestParam(required = false) String status) {
        List<MedicineSubmissionResponse> list;

        if (hasRole(authentication, "PARENT")) {
            Integer userId = getUserIdFromAuthentication(authentication);
            // Phụ huynh xem tất cả đơn của các con (có thể filter theo studentId)
            list = medicineSubmissionService.getAllByParent(userId, studentId, status);
        } else if (hasRole(authentication, "ADMIN") || hasRole(authentication, "NURSE")) {
            // Admin hoặc nhân viên y tế xem tất cả đơn của tất cả học sinh (có thể filter theo studentId và status)
            list = medicineSubmissionService.getAllForAdmin(studentId, null, status);
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(list);
    }

    // Utility methods
    private Integer getUserIdFromAuthentication(Authentication authentication) {
        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();
        Integer userId = userPrincipal.getId();
        return Integer.parseInt(authentication.getName());
    }

    private boolean hasRole(Authentication authentication, String role) {
        return authentication.getAuthorities().stream()
                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_" + role));
    }
}
