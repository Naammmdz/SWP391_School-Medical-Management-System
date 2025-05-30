package com.school.health.entity;

import com.school.health.enums.UserRole;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "Users")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "UserId")
    private Integer userId;

    @NotBlank(message = "Họ tên không được để trống")
    @Column(name = "FullName", length = 100, nullable = false)
    private String fullName;

    @Email(message = "Email không hợp lệ")
    @NotBlank(message = "Email không được để trống")
    @Column(name = "Email", length = 100, nullable = false, unique = true)
    private String email;

    @Pattern(regexp = "^[0-9]{10,11}$", message = "Số điện thoại không hợp lệ")
    @Column(name = "Phone", length = 20)
    private String phone;

    @NotBlank(message = "Mật khẩu không được để trống")
    @Column(name = "PasswordHash", length = 255, nullable = false)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(name = "Role", length = 20, nullable = false)
    private UserRole role;

    @Column(name = "CreatedAT")
    private LocalDate createdAt;

    @Column(name = "IsActive")
    private Boolean isActive = true;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDate.now();
    }
}