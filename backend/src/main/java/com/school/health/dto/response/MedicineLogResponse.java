package com.school.health.dto.response;

import lombok.Data;

import java.time.LocalDate;

@Data
public class MedicineLogResponse {
    private Integer id;
    private Integer submissionId;
    private Integer givenByUserId;
    private String givenByName;
    private LocalDate givenAt;
    private String notes;
}
