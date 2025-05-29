package com.school.health.controller;

import com.school.health.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

    @PostMapping("/login")
    public ResponseEntity<?> login(String username, String password) {

    }
}
