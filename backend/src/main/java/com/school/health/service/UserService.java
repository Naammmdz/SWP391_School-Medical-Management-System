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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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

    public List<UserResponse> getAllUsers(String fullName, String email, String phone,
                                          String roleStr, Boolean isActive,
                                          int pageNum, int pageSize, String sortStr) {
        Specification<User> spec = Specification.where(null);
        if (fullName != null && !fullName.isEmpty()) {
            spec = spec.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.like(criteriaBuilder.
                            lower(root.get("fullName")), "%" + fullName.toLowerCase() + "%"));
        }
        if (email != null && !email.isEmpty()) {
            spec = spec.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.equal(criteriaBuilder.
                            lower(root.get("email")), email.toLowerCase()));
        }
        if (phone != null && !phone.isEmpty()) {
            spec = spec.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.equal(criteriaBuilder.
                            lower(root.get("phone")), phone.toLowerCase()));
        }
        if (roleStr != null && !roleStr.isEmpty()) {
            UserRole role = UserRole.valueOf(roleStr.toUpperCase());
            spec = spec.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.equal(root.get("role"), role));
        }
        if (isActive != null) {
            spec = spec.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.equal(root.get("isActive"), isActive));
        }

        // Phân trang và sắp xếp
        String[] sortDetails = sortStr.split(",");
        String sortByProperty = sortDetails[0];
        Sort.Direction sortDirection = Sort.Direction.ASC;

        if (sortDetails.length > 1 && "desc".equalsIgnoreCase(sortDetails[1])) {
            sortDirection = Sort.Direction.DESC;
        }
        Sort sort = Sort.by(sortDirection, sortByProperty);

        // Tạo đối tượng Pageable
        Pageable pageable = PageRequest.of(pageNum, pageSize, sort);

        // Truy vấn repository với Specification và Pageable
        Page<User> userPage = userRepository.findAll(spec, pageable);

        // Chuyển đổi Page<User> sang List<UserResponse>
        return userPage.getContent().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
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

    //Change password for user
    public void changePassword(Integer id, String oldPassword, String newPassword) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (!passwordEncoder.matches(oldPassword, user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mật khẩu cũ không đúng");
        }

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

}
