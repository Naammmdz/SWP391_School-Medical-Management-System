package com.school.health.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Nationalized;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "QuestionAnswer")
public class QuestionAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "QuestionAnswerId")
    private Long id;

    @Nationalized
    @Column(name = "Question", nullable = false, columnDefinition = "NVARCHAR(1000)")
    private String question;

    @Nationalized
    @Column(name = "Answer", nullable = false, columnDefinition = "NVARCHAR(2000)")
    private String answer;

    @Column(name = "IsActive", nullable = false)
    private Boolean active = true;

    @Column(name = "CreatedAt")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

}
