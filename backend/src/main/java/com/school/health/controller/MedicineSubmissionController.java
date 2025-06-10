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
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/medicine-submissions")
@Validated
public class MedicineSubmissionController {

    @Autowired
    private MedicineSubmissionService medicineSubmissionService;

    //CREATE
    @PostMapping
    public ResponseEntity<MedicineSubmissionResponse> createMedicineSubmission(@Valid @RequestBody MedicineSubmissionRequest medicineSubmissionRequest, Authentication authentication) {
        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();
        Integer userId = userPrincipal.getId();
        MedicineSubmissionResponse medicineSubmissionResponse = medicineSubmissionService.createMedicineSubmission(medicineSubmissionRequest, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(medicineSubmissionResponse);
    }
}
