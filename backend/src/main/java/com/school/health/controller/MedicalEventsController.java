package com.school.health.controller;

import com.school.health.dto.request.MedicalEventsFiltersRequestDTO;
import com.school.health.dto.request.MedicalEventsRequestDTO;
import com.school.health.dto.response.MedicalEventsResponseDTO;
import com.school.health.security.services.UserDetailsImpl;
import com.school.health.service.impl.MedicalEventsServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.apache.commons.collections4.Get;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController

@CrossOrigin(origins = "*")
@Validated
@RequiredArgsConstructor

public class MedicalEventsController {
    private final MedicalEventsServiceImpl medicalEventsService;
    @PreAuthorize("hasRole('NURSE')")
    @PostMapping("/api/nurse/medical-events")
    public ResponseEntity<MedicalEventsResponseDTO> addMedicalEvent(@RequestBody @Valid MedicalEventsRequestDTO medicalEventsRequestDTO, Authentication authentication) {
        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();
        Integer userId = userPrincipal.getId();
        return ResponseEntity.ok(medicalEventsService.createMedicalEvents(userId, medicalEventsRequestDTO));
    }
    @PreAuthorize("hasRole('NURSE')")
    @PostMapping("/api/nurse/medical-events/search")
    public ResponseEntity<List<MedicalEventsResponseDTO>> getAllMedicalEvents(@RequestBody MedicalEventsFiltersRequestDTO medicalEventsFiltersRequestDTO) {
        return ResponseEntity.ok(medicalEventsService.getAllMedicalEvents(medicalEventsFiltersRequestDTO));
    }
    @PreAuthorize("hasRole('NURSE')")
    @GetMapping("/api/nurse/medical-events/{eventId}")
    public ResponseEntity<MedicalEventsResponseDTO> getMedicalEvent(@PathVariable Integer eventId) {
        return ResponseEntity.ok(medicalEventsService.getMedicalEvents(eventId));
    }

    //update medical event
    @PreAuthorize("hasRole('NURSE')")
    @PutMapping("/api/nurse/medical-events/{eventId}")
    public ResponseEntity<MedicalEventsResponseDTO> updateMedicalEvent(@RequestBody MedicalEventsRequestDTO medicalEventsRequestDTO, @PathVariable Integer eventId) {
        return ResponseEntity.ok(medicalEventsService.updateMedicalEvents(eventId, medicalEventsRequestDTO));
    }
    @PreAuthorize("hasRole('PARENT')")
    @GetMapping("/api/parent/medical-events/")
    public ResponseEntity<List<MedicalEventsResponseDTO>> getAllMedicalEventByStudentId(@RequestParam Integer studentId) {
        return ResponseEntity.ok(medicalEventsService.getMedicalEventByStudentID(studentId));
    }
}
