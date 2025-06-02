package com.school.health.service;

import com.school.health.dto.request.UserUpdateRequest;
import com.school.health.dto.response.UserResponse;
import com.school.health.entity.User;
import com.school.health.enums.UserRole;
import com.school.health.exception.UserAlreadyExistsException;
import com.school.health.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Đăng kí user
    public User registerUser(String fullName, String email, String phone, String plainPassword, UserRole role) {
        // Check exits
        if (userRepository.existsByEmail(email)) {
            throw new UserAlreadyExistsException("email", "User with this email already exists");
        }
        if (userRepository.existsByPhone(phone)) {
            throw new UserAlreadyExistsException("phone", "User with this phone already exists");
        }

        User newUser = new User();
        newUser.setFullName(fullName);
        newUser.setEmail(email);
        newUser.setPhone(phone);
        newUser.setPasswordHash(passwordEncoder.encode(plainPassword));
        newUser.setRole(role);

        return userRepository.save(newUser);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<User> getUserByPhone(String phone) {
        return userRepository.findByPhone(phone);
    }

    public Optional<User> getUserById(Integer id) {
        return userRepository.findByUserId(id);
    }

    public List<UserResponse> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream().map(this::convertToDto).toList();
    }

    private UserResponse convertToDto(User user) {
        UserResponse dto = new UserResponse();
        dto.setId(user.getUserId());
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setIsActive(user.isActive());
        dto.setRole(user.getRole().name());
        return dto;
    }

    public void updateUserId(Integer id, UserUpdateRequest userUpdateRequest) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));

        if (userUpdateRequest.getFullName() != null) {
            user.setFullName(userUpdateRequest.getFullName());
        }
        if (userUpdateRequest.getEmail() != null) {
            // Chỉ check exists nếu email mới khác email hiện tại
            if (!userUpdateRequest.getEmail().equals(user.getEmail())) {
                if (userRepository.existsByEmail(userUpdateRequest.getEmail())) {
                    throw new UserAlreadyExistsException("email", "User with this email already exists");
                }
                user.setEmail(userUpdateRequest.getEmail());
            }
        }
        if (userUpdateRequest.getPhone() != null) {
            // Chỉ check exists nếu phone mới khác phone hiện tại
            if (!userUpdateRequest.getPhone().equals(user.getPhone())) {
                if (userRepository.existsByPhone(userUpdateRequest.getPhone())) {
                    throw new UserAlreadyExistsException("phone", "User with this phone already exists");
                }
                user.setPhone(userUpdateRequest.getPhone());
            }
        }
        userRepository.save(user);
    }

    public void updateUserStatus(Integer id, boolean isActive) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        user.setActive(isActive);
        userRepository.save(user);
    }
}
