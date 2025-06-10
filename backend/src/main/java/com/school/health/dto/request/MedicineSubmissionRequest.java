package com.school.health.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class MedicineSubmissionRequest {

    @NotNull
    private Integer studentId;

    @NotBlank
    @Size(max = 255)
    private String instruction;

    @Min(1)
    private Integer duration;

    @NotNull
    private LocalDate startDate;

    @NotNull
    private LocalDate endDate;

    @Size(max = 500)
    private String notes;

    @NotEmpty
    private List<MedicineDetailRequest> medicineDetails;
}
