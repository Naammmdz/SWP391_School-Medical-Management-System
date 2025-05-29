package com.school.health.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "Users")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Users {@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
    private long userId;
    private String fullName;
    private String email;
    private String phone;
    private String passwordHash;
    private String role; // e.g., "PARENT", "ADMIN", "NURSE"
    private LocalDateTime createdAt;
    private boolean isActive;
}
