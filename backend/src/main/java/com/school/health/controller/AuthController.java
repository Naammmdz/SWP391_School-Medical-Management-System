package com.school.health.controller;

import com.school.health.dto.request.LoginRequest;
import com.school.health.dto.request.RegisterRequest;
import com.school.health.dto.response.LoginSuccessResponse;
import com.school.health.dto.response.MessageResponse;
import com.school.health.security.jwt.JwtUtils;
import com.school.health.security.services.UserDetailsImpl;
import com.school.health.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
@Validated
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        // Xác thực thông tin đăng nhập
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmailOrPhone(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Lấy thông tin từ UserDetails (đã xác thực)
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String jwt = jwtUtils.generateJwtToken(authentication);

        return ResponseEntity.ok(new LoginSuccessResponse(
                jwt,
                "Bearer",
                userDetails.getId(),
                userDetails.getEmail(),
                userDetails.getPhone(),
                userDetails.getFullName(),
                userDetails.getAuthorities().iterator().next().getAuthority()
        ));
    }
}