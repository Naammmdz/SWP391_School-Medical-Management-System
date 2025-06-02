package com.school.health.controller;


import com.school.health.dto.request.RegisterRequest;
import com.school.health.dto.request.UserUpdateRequest;
import com.school.health.security.services.UserDetailsImpl;
import com.school.health.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/user")
@Validated
public class UserController {

    @Autowired
    private UserService userService;

    // 1. User tự cập nhật tài khoản của mình
    @PutMapping("/me")
    public ResponseEntity<?> updateMyAccount(
            Authentication authentication,
            @RequestBody UserUpdateRequest userUpdateRequest
    ) {
        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();
        Integer userId = userPrincipal.getId();
        try {
            userService.updateUserId(userId, userUpdateRequest);
            return ResponseEntity.ok(Map.of("message", "Cập nhật tài khoản thành công!"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Cập nhật tài khoản thất bại!"));
        }
    }

    // 2. Admin cập nhật tài khoản của bất kỳ user nào
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateUserByAdmin(
            @PathVariable Integer id,
            @RequestBody UserUpdateRequest userUpdateRequest
    ) {
        userService.updateUserId(id, userUpdateRequest);
        return ResponseEntity.ok(Map.of("message", "Cập nhật thông tin người dùng thành công!"));
    }
}
