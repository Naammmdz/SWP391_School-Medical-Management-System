package com.school.health.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class HealthProfileParentRequestDTO {

    @Size(max = 255)
    private String allergies;

    @Size(max = 255)
    private String chronicDiseases;

    @Size(max = 255)
    private String treatmentHistory;

    @Pattern(regexp = "^(?:[0-9]{1,2}/[0-9]{1,2})?$", message = "eyeSight phải đúng định dạng VD: 10/10, 7/10")
    private String eyeSight;

    @Size(max = 50)
    private String hearing;

    @Pattern(regexp = "^(A|B|AB|O)[+-]$", message = "bloodType phải là A+, O-, AB+,...")
    private String bloodType;

    @DecimalMin(value = "1.0", message = "weight phải > 1kg")
    @DecimalMax(value = "300.0", message = "weight không được > 300kg")
    private double weight;

    @DecimalMin(value = "30.0", message = "height phải > 30cm")
    @DecimalMax(value = "250.0", message = "height không được > 250cm")
    private double height;

    @Size(max = 255)
    private String notes;
}

