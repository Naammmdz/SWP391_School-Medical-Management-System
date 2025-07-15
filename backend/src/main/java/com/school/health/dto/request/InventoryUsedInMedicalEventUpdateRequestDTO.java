package com.school.health.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class InventoryUsedInMedicalEventUpdateRequestDTO {
    private Integer id;
    private Integer itemId;
    @Min(value = 0, message = "Số lượng đã dùng chưa hợp lí")
    private Integer quantityUsed;
    private String notes; // Ghi chú (có thể null)
}
