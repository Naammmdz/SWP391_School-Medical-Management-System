package com.school.health.controller;

import com.school.health.dto.request.LoginRequest;
import com.school.health.dto.request.RefreshRequest;
import com.school.health.dto.request.RegisterRequest;
import com.school.health.dto.response.LoginSuccessResponse;
import com.school.health.enums.UserRole;
import com.school.health.security.jwt.JwtUtils;
import com.school.health.security.services.UserDetailsImpl;
import com.school.health.security.services.UserDetailsServiceImpl;
import com.school.health.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

//import jakarta.validation.Valid;

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
    @Autowired
    private UserDetailsServiceImpl userDetailsServiceImpl;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody @Valid RegisterRequest request) {
        UserRole role = UserRole.valueOf(request.getRole());
        userService.registerUser(
                request.getFullName(),
                request.getEmail(),
                request.getPhone(),
                request.getPassword(),
                role
        );
        return ResponseEntity.ok(Map.of("message", "Đăng ký thành công!"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmailOrPhone(),
                            loginRequest.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            String accessToken = jwtUtils.generateJwtToken(authentication);
            String refreshToken = jwtUtils.generateRefreshToken(authentication);

            return ResponseEntity.ok(new LoginSuccessResponse(
                    accessToken,
                    refreshToken,
                    "Bearer",
                    userDetails.getId(),
                    userDetails.getEmail(),
                    userDetails.getPhone(),
                    userDetails.getFullName(),
                    userDetails.getAuthorities().iterator().next().getAuthority()
            ));
        } catch (BadCredentialsException ex) {
            // Trả về JSON lỗi
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Thông tin đăng nhập không đúng!"));
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshAccessToken(@RequestBody RefreshRequest req) {
        String refreshToken = req.getRefreshToken();
        if (jwtUtils.validateJwtToken(refreshToken)) {
            String username = jwtUtils.getUsernameFromJwtToken(refreshToken);
            // Lấy UserDetails từ username
            UserDetailsImpl userDetails = (UserDetailsImpl) userDetailsServiceImpl.loadUserByUsername(username);

            Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
            String newAccessToken = jwtUtils.generateJwtToken(authentication);

            return ResponseEntity.ok(Map.of("accessToken", newAccessToken, "type", "Bearer"));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid refresh token"));
        }
    }

}