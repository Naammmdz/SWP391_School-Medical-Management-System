//package com.school.health.controller;
//
//
//import com.school.health.dto.request.CreateHealthProfileDTO;
//import com.school.health.dto.request.UpdateHealthProfileDTO;
//import com.school.health.dto.response.HealthProfileResponseDTO;
//import com.school.health.service.HealthProfileService;
//import jakarta.validation.Valid;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
////import org.springframework.security.access.prepost.PreAuthorize;
//import org.springframework.web.bind.annotation.*;
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/health-profiles")
//@RequiredArgsConstructor
//@CrossOrigin(origins = "*") // Cho phép React frontend gọi API
//public class HealthProfileParentController {
//
//    private final HealthProfileService healthProfileService;
//
//    /**
//     * Phụ huynh tạo hồ sơ sức khỏe cho con
//     * POST /api/health-profiles
//     */
//    @PostMapping
////    @PreAuthorize("hasRole('PARENT') or hasRole('NURSE') or hasRole('ADMIN')")
//    public ResponseEntity<HealthProfileResponseDTO> createHealthProfile(
//            @Valid @RequestBody CreateHealthProfileDTO dto) {
//
//        HealthProfileResponseDTO response = healthProfileService.createHealthProfile(dto);
//        return new ResponseEntity<>(response, HttpStatus.CREATED);
//    }
//
//    /**
//     * Cập nhật hồ sơ sức khỏe
//     * PUT /api/health-profiles/student/{studentId}
//     */
//    @PutMapping("/student/{studentId}")
////    @PreAuthorize("hasRole('PARENT') or hasRole('NURSE') or hasRole('ADMIN')")
//    public ResponseEntity<HealthProfileResponseDTO> updateHealthProfile(
//            @PathVariable Integer studentId,
//            @Valid @RequestBody UpdateHealthProfileDTO dto) {
//
//        HealthProfileResponseDTO response = healthProfileService.updateHealthProfile(studentId, dto);
//        return ResponseEntity.ok(response);
//    }
//
//    /**
//     * Lấy hồ sơ sức khỏe theo student ID
//     * GET /api/health-profiles/student/{studentId}
//     */
//    @GetMapping("/student/{studentId}")
////    @PreAuthorize("hasRole('PARENT') or hasRole('NURSE') or hasRole('MANAGER') or hasRole('ADMIN')")
//    public ResponseEntity<HealthProfileResponseDTO> getHealthProfileByStudentId(
//            @PathVariable Integer studentId) {
//
//        HealthProfileResponseDTO response = healthProfileService.getHealthProfileByStudentId(studentId);
//        return ResponseEntity.ok(response);
//    }
//
//    /**
//     * Phụ huynh xem hồ sơ sức khỏe của tất cả các con
//     * GET /api/health-profiles/parent/{parentId}
//     */
//    @GetMapping("/parent/{parentId}")
////    @PreAuthorize("hasRole('PARENT') or hasRole('NURSE') or hasRole('MANAGER') or hasRole('ADMIN')")
//    public ResponseEntity<List<HealthProfileResponseDTO>> getHealthProfilesByParentId(
//            @PathVariable Integer parentId) {
//
//        List<HealthProfileResponseDTO> response = healthProfileService.getHealthProfilesByParentId(parentId);
//        return ResponseEntity.ok(response);
//    }
//
//    /**
//     * Y tá xem danh sách học sinh có dị ứng
//     * GET /api/health-profiles/allergies
//     */
//    @GetMapping("/allergies")
////    @PreAuthorize("hasRole('NURSE') or hasRole('MANAGER') or hasRole('ADMIN')")
//    public ResponseEntity<List<HealthProfileResponseDTO>> getStudentsWithAllergies() {
//
//        List<HealthProfileResponseDTO> response = healthProfileService.getStudentsWithAllergies();
//        return ResponseEntity.ok(response);
//    }
//
//    /**
//     * Y tá xem danh sách học sinh có bệnh mãn tính
//     * GET /api/health-profiles/chronic-diseases
//     */
//    @GetMapping("/chronic-diseases")
////    @PreAuthorize("hasRole('NURSE') or hasRole('MANAGER') or hasRole('ADMIN')")
//    public ResponseEntity<List<HealthProfileResponseDTO>> getStudentsWithChronicDiseases() {
//
//        List<HealthProfileResponseDTO> response = healthProfileService.getStudentsWithChronicDiseases();
//        return ResponseEntity.ok(response);
//    }
//
//    /**
//     * Xóa hồ sơ sức khỏe
//     * DELETE /api/health-profiles/student/{studentId}
//     */
//    @DeleteMapping("/student/{studentId}")
//    @PreAuthorize("hasRole('ADMIN')")
//    public ResponseEntity<Void> deleteHealthProfile(@PathVariable Integer studentId) {
//
//        healthProfileService.deleteHealthProfile(studentId);
//        return ResponseEntity.noContent().build();
//    }
//}