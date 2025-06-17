package com.school.health.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class MedicineLogRequest {
    private Integer givenByUserId;
    private LocalDate givenAt;
    private String notes;
}
