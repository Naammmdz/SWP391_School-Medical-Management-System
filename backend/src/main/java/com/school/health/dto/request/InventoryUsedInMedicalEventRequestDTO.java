package com.school.health.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class InventoryUsedInMedicalEventRequestDTO {
    @NotNull(message = "Item ID không được để trống!")
    private Integer itemId;
    @NotNull(message = "Số lượng đã dùng không được để trống")
    @Min(value = 1, message = "Số lượng đã dùng phải lớn hơn 0")
    private Integer quantityUsed;

    private String notes; // Ghi chú (có thể null)
}
