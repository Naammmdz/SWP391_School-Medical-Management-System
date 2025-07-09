package com.school.health.entity;

import com.school.health.enums.InventoryStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
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

    @Column(name = "MinStockLevel")
    private int minStockLevel;

    @Column(name = "ExpiryDate")
    private LocalDate expiryDate;

    @Column(name = "BatchNumber", columnDefinition = "NVARCHAR(50)")
    private String batchNumber;

    @Column(name = "Manufacturer", columnDefinition = "NVARCHAR(100)")
    private String manufacturer;

    @Column(name = "ImportDate")
    private LocalDate importDate;

    @Column(name = "ImportPrice", precision = 19, scale = 2)
    private BigDecimal importPrice;

    @Column(name = "StorageLocation", columnDefinition = "NVARCHAR(100)")
    private String storageLocation;

    @Enumerated(EnumType.STRING)
    @Column(name = "Status", columnDefinition = "NVARCHAR(20)")
    private InventoryStatus status;

    @Column(name = "Source", columnDefinition = "NVARCHAR(200)")
    private String source;

    @CreationTimestamp
    @Column(name = "CreatedAt")
    private LocalDateTime createdAt;
}
