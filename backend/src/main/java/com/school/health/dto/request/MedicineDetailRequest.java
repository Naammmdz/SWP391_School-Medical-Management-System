package com.school.health.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class MedicineDetailRequest {
    @NotBlank
    @Size(max = 100)
    private String medicineName;

    @NotBlank
    @Size(max = 100)
    private String medicineDosage;
}
