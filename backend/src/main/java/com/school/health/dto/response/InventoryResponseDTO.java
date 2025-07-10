package com.school.health.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.school.health.enums.InventoryStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class InventoryResponseDTO {
    private int itemId;
    private String name;
    private String type;
    private String unit;
    private int quantity;
    private int minStockLevel;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate expiryDate;
    
    private String batchNumber;
    private String manufacturer;
    
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate importDate;
    
    private BigDecimal importPrice;
    private String storageLocation;
    private InventoryStatus status;
    private String source;
    
    private String createdAt;
}

