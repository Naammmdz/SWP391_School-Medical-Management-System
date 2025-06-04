package com.school.health.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

import jakarta.validation.constraints.*;

import java.time.LocalDate;

@Entity
@Table(name = "Students")
@Data
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "StudentId")
    private Integer studentId;

    @NotBlank(message = "Họ tên học sinh không được để trống")
    @Column(name = "FullName", length = 100, nullable = false)
    private String fullName;

    @NotNull(message = "Ngày sinh không được để trống")
    @Past(message = "Ngày sinh phải là ngày trong quá khứ")
    @Column(name = "DOB", nullable = false)
    private LocalDate dob;

    @Pattern(regexp = "^(Nam|Nữ)$", message = "Giới tính chỉ có thể là Nam hoặc Nữ")
    @Column(name = "Gender", length = 10)
    private String gender;

    @Column(name = "ClassName", length = 50)
    private String className;

    @ManyToOne
    @JoinColumn(name = "ParentId", referencedColumnName = "UserId")
    private User parentId;

    @Column(name = "CreatedAt")
    private LocalDateTime createdAt;

    // Relationship với HealthProfile
    @OneToOne(mappedBy = "student", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private HealthProfile healthProfile;



    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}