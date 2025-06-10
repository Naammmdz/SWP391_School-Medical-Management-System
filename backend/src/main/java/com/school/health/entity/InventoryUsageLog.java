package com.school.health.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "InventoryUsageLog")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class InventoryUsageLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "UsageId", nullable = false)
    private int id;

    @ManyToOne
    @JoinColumn(name = "ItemId", nullable = false)
    private Inventory item;

    @Column(name = "QuantityUsed")
    private int quantityUsed;

    @Column(name = "UsedAt")
    private LocalDateTime usedAt;

    @ManyToOne
    @JoinColumn(name = "RelatedEventId")
    private MedicalEvent relatedEvent;

    @Column(name = "Notes", columnDefinition = "NVARCHAR(255)")
    private String notes;
}