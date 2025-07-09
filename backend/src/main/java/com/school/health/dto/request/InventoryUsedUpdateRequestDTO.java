package com.school.health.dto.request;

import lombok.Data;

@Data
public class InventoryUsedUpdateRequestDTO {
    private Integer itemId;
    private Integer quantityUsed;
    private Integer relatedEventId; // ← Bổ sung
    private String notes;
}
