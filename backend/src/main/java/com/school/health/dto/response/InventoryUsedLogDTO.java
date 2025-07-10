package com.school.health.dto.response;

import lombok.Data;

@Data
public class InventoryUsedLogDTO {

        private Integer id;
        private String medicineName;
        private Integer medicineId;       // ID của thuốc
        private int quantityUsed;
        private String unit;              // Đơn vị tính (nếu có)
        private String usageNote;
}
