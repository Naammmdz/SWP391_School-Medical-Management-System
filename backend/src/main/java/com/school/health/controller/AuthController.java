package com.school.health.controller;

import com.school.health.dto.request.RegisterRequest;
import com.school.health.dto.respone.MessageResponse;
import com.school.health.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;
    // @Autowired
    // AuthenticationManager authenticationManager; // Sẽ inject sau khi cấu hình Spring Security

    // @Autowired
    // JwtUtils jwtUtils; // Sẽ inject sau khi cấu hình JWT

//    @PostMapping("/register")
//    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
//        try {
//            return ResponseEntity.ok(new MessageResponse("Người dùng [" + registeredUser.getFullName() + "] đã đăng ký thành công!"));
//        } catch (RuntimeException e) {
//            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage()));
//        }
//    }

    @PostMapping("/login")
    public ResponseEntity<?> login(String username, String password) {
        return ResponseEntity.ok(new MessageResponse());
    }
}
