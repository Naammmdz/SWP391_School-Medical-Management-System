package com.school.health.controller;

import com.school.health.dto.request.LoginRequest;
import com.school.health.dto.request.RegisterRequest;
import com.school.health.dto.response.LoginSuccessResponse;
import com.school.health.enums.UserRole;
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

    @PostMapping("/register")
    public String register(@RequestBody @Valid RegisterRequest request) {
        try {
            UserRole role = UserRole.valueOf(request.getRole());
            userService.registerUser(
                    request.getFullName(),
                    request.getEmail(),
                    request.getPhone(),
                    request.getPassword(),
                    role
            );
            return "Đăng ký thành công!";
        } catch (RuntimeException e) {
            return e.getMessage(); // Có thể trả về lỗi chi tiết hơn nếu muốn
        } catch (Exception e) {
            return "Đăng ký thất bại!";
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmailOrPhone(),
                            loginRequest.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
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