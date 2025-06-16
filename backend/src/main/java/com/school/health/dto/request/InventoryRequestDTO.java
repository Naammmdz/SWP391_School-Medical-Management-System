package com.school.health.dto.request;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Data;

import java.time.LocalDate;



@Data
public class InventoryRequestDTO {
    private String name;
    private String type;           // Ví dụ: "Medicine", "Supply"
    private String unit;           // Ví dụ: "Hộp", "Chiếc"
    @Min(value = 0, message = "Số lượng không được nhỏ hơn 0")
    @Max(value = 2000, message = "Số lượng không được vượt quá 2000")
    private Integer quantity;
    @Min(value = 1, message = "Số lượng báo động không được nhỏ hơn 1")
    @Max(value = 100, message = "Số lượng báo động không được vượt quá 100")
    private Integer minStockLevel;

    @FutureOrPresent(message = "Ngày hết hạn không được là ngày trong quá khứ")
    private LocalDate expiryDate;
}

