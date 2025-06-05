package com.school.health.controller;


import com.school.health.dto.request.RegisterRequest;
import com.school.health.dto.request.UserUpdateRequest;
import com.school.health.dto.response.BulkImportResponse;
import com.school.health.dto.response.UserResponse;
import com.school.health.entity.User;
import com.school.health.security.services.UserDetailsImpl;
import com.school.health.service.ExcelService;
import com.school.health.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/user")
@Validated
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private ExcelService excelService;

    // 1. User tự cập nhật tài khoản của mình
    @PutMapping("/me")
    public ResponseEntity<?> updateMyAccount(
            Authentication authentication,
            @RequestBody @Valid UserUpdateRequest userUpdateRequest
    ) {
        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();
        Integer userId = userPrincipal.getId();
        try {
            userService.updateUserId(userId, userUpdateRequest);
            return ResponseEntity.ok(Map.of("message", "Cập nhật tài khoản thành công!"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Cập nhật tài khoản thất bại!"));
        }
    }

    // 2. Admin cập nhật tài khoản của bất kỳ user nào
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateUserByAdmin(
            @PathVariable Integer id,
            @RequestBody @Valid UserUpdateRequest userUpdateRequest
    ) {
        userService.updateUserId(id, userUpdateRequest);
        return ResponseEntity.ok(Map.of("message", "Cập nhật thông tin người dùng thành công!"));
    }

    // 3. Admin đổi trạng thái của user
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateUserStatus(
            @PathVariable Integer id,
            @RequestParam boolean isActive
    ) {
        try {
            userService.updateUserStatus(id, isActive);
            return ResponseEntity.ok(Map.of("message", "Cập nhật trạng thái người dùng thành công!"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Cập nhật trạng thái người dùng thất bại!"));
        }
    }

    // 4. Admin lấy thông tin của tất cả user
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // 5. User lấy thông tin tài khoản của mình
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getMyAccount(Authentication authentication) {
        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();
        Integer userId = userPrincipal.getId();
        User user = userService.getUserById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        UserResponse response = new UserResponse();
        response.setId(user.getUserId());
        response.setFullName(user.getFullName());
        response.setEmail(user.getEmail());
        response.setPhone(user.getPhone());
        response.setIsActive(user.isActive());
        response.setRole(user.getRole().name());
        return ResponseEntity.ok(response);
    }

    // 6. User đổi mật khẩu của mình


    // 7. Admin tải file Excel để template import user
    @GetMapping("/admin/template")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ByteArrayResource> downloadTemplate() throws IOException {
        byte[] templateData = excelService.generateTemplate();
        ByteArrayResource resource = new ByteArrayResource(templateData);

        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
        String filename = "user_template_" + timestamp + ".xlsx";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .contentLength(templateData.length)
                .body(resource);
    }

    // 8. Admin bulk import user từ file Excel
    @PostMapping(value = "/admin/bulk-import", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BulkImportResponse> bulkImportUsers(@RequestParam("file") MultipartFile file) throws IOException {
        if (file.isEmpty()) throw new RuntimeException("File không được để trống!");
        if (!file.getOriginalFilename().endsWith(".xlsx") && !file.getOriginalFilename().endsWith(".xls")) {
            throw new RuntimeException("Chỉ hỗ trợ file Excel (.xlsx hoặc .xls)!");
        }
        BulkImportResponse result = excelService.importUsersFromExcel(file);
        return ResponseEntity.ok(result);
    }
}
