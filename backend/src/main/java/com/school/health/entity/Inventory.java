package com.school.health.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "Inventory")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Inventory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ItemId", nullable = false)
    private int id;

    @Column(name = "Name", columnDefinition = "NVARCHAR(100)")
    private String name;

    @Column(name = "Type", columnDefinition = "NVARCHAR(50)")
    private String type;

    @Column(name = "Unit", columnDefinition = "NVARCHAR(20)")
    private String unit;

    @Column(name = "Quantity")
    private int quantity;

    @Column(name = "ExpiryDate")
    private LocalDate expiryDate;

    @Column(name = "CreatedAt")
    private LocalDateTime createdAt;
}