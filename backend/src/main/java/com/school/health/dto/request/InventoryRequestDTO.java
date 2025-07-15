package com.school.health.dto.request;

import com.school.health.enums.InventoryStatus;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class InventoryRequestDTO {
    @NotBlank(message = "Tên không được để trống")
    private String name;
    
    @NotBlank(message = "Loại không được để trống")
    private String type;           // Ví dụ: "Medicine", "Supply"
    
    @NotBlank(message = "Đơn vị không được để trống")
    private String unit;           // Ví dụ: "Hộp", "Chiếc"
    
    @Min(value = 0, message = "Số lượng không được nhỏ hơn 0")
    @Max(value = 2000, message = "Số lượng không được vượt quá 2000")
    private Integer quantity;
    
    @Min(value = 1, message = "Số lượng báo động không được nhỏ hơn 1")
    @Max(value = 100, message = "Số lượng báo động không được vượt quá 100")
    private Integer minStockLevel;

    @FutureOrPresent(message = "Ngày hết hạn không được là ngày trong quá khứ")
    private LocalDate expiryDate;
    
    @NotBlank(message = "Số lô không được để trống")
    private String batchNumber;
    
    @NotBlank(message = "Nhà sản xuất không được để trống")
    private String manufacturer;

    @PastOrPresent(message = "Ngày nhập không được là ngày trong tương lai")
    @NotNull(message = "Ngày nhập không được để trống")
    private LocalDate importDate;
    
    @DecimalMin(value = "0.0", inclusive = false, message = "Giá nhập phải lớn hơn 0")
    private BigDecimal importPrice;
    
    @NotBlank(message = "Vị trí lưu trữ không được để trống")
    private String storageLocation;
    
    @NotNull(message = "Trạng thái không được để trống")
    private InventoryStatus status;
    
    @NotBlank(message = "Nguồn cung cấp không được để trống")
    private String source;

}

