package com.school.health.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table (name = "Notification")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column (name = "NotificationId", nullable = false)
    private int id;
    @ManyToOne
    @JoinColumn (name = "ToUserId")

    private User toUserId;

    @Column (name ="Title", columnDefinition = "NVARCHAR(100)")
    private String title;
    @Column (name ="Message", columnDefinition = "NVARCHAR(255)")
    private String message;
    @Column (name ="IsRead")
    private boolean isRead;
    @CreationTimestamp
    @Column (name ="CreatedAt")
    private LocalDateTime createdAt;


}
