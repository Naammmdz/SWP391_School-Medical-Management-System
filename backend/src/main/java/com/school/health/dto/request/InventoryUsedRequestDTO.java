package com.school.health.dto.request;

import com.school.health.repository.InventoryRepo;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;

@Data
public class InventoryUsedRequestDTO {


    @NotNull(message = "Số lượng đã dùng không được để trống")
    @Min(value = 0, message = "Số lượng đã dùng không khả dụng!!")
    private Integer quantityUsed;

    @NotNull(message = "Sự kiện y tế liên quan không được để trống")
    private Integer relatedEventId;

    private String notes; // Ghi chú (có thể null)
}
