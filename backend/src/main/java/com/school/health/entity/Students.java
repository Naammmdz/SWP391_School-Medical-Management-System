package com.school.health.entity;

import com.school.health.enums.Gender;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;
import java.time.LocalDateTime;

@Entity
@Table(name = "Students")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Students {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long studentId;

    private String fullName;
    private Date dob;
    private Gender gender;
    private String className;
    private LocalDateTime createdAt;

    // Parent relationship
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id", referencedColumnName = "userId")
    private Users parent;

    // One-to-one Health Profile
    @OneToOne(mappedBy = "student", cascade = CascadeType.ALL)
    private HealthProfile healthProfile;
}
