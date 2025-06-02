package com.school.health.service;

import com.school.health.dto.request.UserUpdateRequest;
import com.school.health.entity.User;
import com.school.health.enums.UserRole;
import com.school.health.exception.UserAlreadyExistsException;
import com.school.health.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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

    public void updateUserId(Integer id, @Valid UserUpdateRequest userUpdateRequest) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));

        if (userUpdateRequest.getFullName() != null) {
            user.setFullName(userUpdateRequest.getFullName());
        }
        if (userUpdateRequest.getEmail() != null) {
            if (userRepository.existsByEmail(userUpdateRequest.getEmail())) {
                throw new UserAlreadyExistsException("email", "User with this email already exists");
            }
            user.setEmail(userUpdateRequest.getEmail());
        }
        if (userUpdateRequest.getPhone() != null) {
            if (userRepository.existsByPhone(userUpdateRequest.getPhone())) {
                throw new UserAlreadyExistsException("phone", "User with this phone already exists");
            }
            user.setPhone(userUpdateRequest.getPhone());
        }
        userRepository.save(user);
    }
}
