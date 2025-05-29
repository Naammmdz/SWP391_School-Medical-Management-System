package com.school.health.entity;

import com.school.health.enums.UserRole;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Nationalized;

import java.time.LocalDate;

@Entity
@Table(name = "Users", uniqueConstraints = {
        @UniqueConstraint(columnNames = "Phone")
})
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "UserId")
    private Integer userId;

    @Column(name = "FullName", nullable = false, length = 100)
    private String fullName;

    @Column(name = "Email", length = 100)
    private String email;

    @Column(name = "Phone", nullable = false, length = 20)
    private String phone;

    @Column(name = "PasswordHash", nullable = false, length = 255)
    private String passwordHash;
    @Nationalized

    @Enumerated(EnumType.STRING)
    @Column(name = "Role", nullable = false, length = 20)
    private UserRole role;


    @Column(name = "CreateAT")
    private LocalDate createAt;

    @Column(name = "IsActive")
    private boolean isActive = true;

}
