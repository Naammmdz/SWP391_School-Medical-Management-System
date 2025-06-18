package com.school.health.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

import jakarta.validation.constraints.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;

@Entity
@Table(name = "Students")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "StudentId")
    private Integer studentId;

    @NotBlank(message = "Họ tên học sinh không được để trống")
    @Column(name = "FullName", length = 100, nullable = false,columnDefinition = "NVARCHAR(255)")
    private String fullName;

    @NotNull(message = "Ngày sinh không được để trống")
    @Past(message = "Ngày sinh phải là ngày trong quá khứ")
    @Column(name = "DOB", nullable = false)
    private LocalDate dob;

    @Pattern(regexp = "^(Nam|Nữ)$", message = "Giới tính chỉ có thể là Nam hoặc Nữ")
    @Column(name = "Gender", length = 10,columnDefinition = "NVARCHAR(255)")
    private String gender;

    @Column(name = "ClassName", length = 50)
    private String className;

    // Parent
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ParentId", nullable = false)
    @JsonIgnore //Thêm dòng này để không serialize Parent nữa
    private User parent;

    // xóa student bằng cách isActive
    // cascade = CascadeType.ALL tức là khi xóa Student thì sẽ xóa luôn HealthProfile
    @Column(name = "IsActive", nullable = false)
    private boolean isActive;

    @OneToOne(mappedBy = "student", cascade = CascadeType.ALL)
    private HealthProfile healthProfile;

    @CreationTimestamp
    @Column(name = "CreatedAt")
    private LocalDateTime createdAt;

}