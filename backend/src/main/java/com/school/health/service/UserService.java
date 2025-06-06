package com.school.health.service;

import com.school.health.dto.request.UserUpdateRequest;
import com.school.health.dto.response.UserResponse;
import com.school.health.entity.User;
import com.school.health.enums.UserRole;

import java.util.List;
import java.util.Optional;

public interface UserService {

    User registerUser(String fullName, String email, String phone, String plainPassword, UserRole role);

    Optional<User> getUserByEmail(String email);

    Optional<User> getUserByPhone(String phone);

    Optional<User> getUserById(Integer id);

    List<UserResponse> getAllUsers();

    UserResponse convertToDto(User user);

    void updateUserId(Integer id, UserUpdateRequest userUpdateRequest);

    void updateUserStatus(Integer id, boolean isActive);
}
