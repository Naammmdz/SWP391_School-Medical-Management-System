package com.school.health.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "InventoryUsedLog")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class InventoryUsedLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "UsageId", nullable = false)
    private int id;

    //Một cái này có thể dùng nhiều iTem
    @ManyToOne
    @JoinColumn(name = "ItemId", nullable = false)
    private Inventory item;

    @Column(name = "QuantityUsed")
    private int quantityUsed;

    @CreationTimestamp
    @Column(name = "UsedAt")
    private LocalDateTime usedAt;

    @ManyToOne
    @JoinColumn(name = "RelatedEventId")
    private MedicalEvent relatedEvent;

    @Column(name = "Notes", columnDefinition = "NVARCHAR(255)")
    private String notes;
}