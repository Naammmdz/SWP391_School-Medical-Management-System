package com.school.health.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class StatusUpdateRequest {
    @NotBlank
    private String submissionStatus; // "APPROVED" or "REJECTED"

    @NotNull
    private Integer approvedBy;

    @NotNull
    private LocalDate approvedAt;
}
