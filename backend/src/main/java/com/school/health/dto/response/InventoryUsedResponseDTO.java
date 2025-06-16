package com.school.health.dto.response;

import lombok.Data;

import java.time.LocalDateTime;
@Data
public class InventoryUsedResponseDTO {
    private int id;
    private Integer itemId;
    private Integer quantitUsed;
    private LocalDateTime usedAt;
    private Integer relatedEvenId;
    private String notes;
}
