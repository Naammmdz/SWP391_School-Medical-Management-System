package com.school.health.dto.response;

import java.time.LocalDate;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VaccinationResponseDTO {
    private LocalDate date;
    private String notes;
    private boolean parentConfirmation;
    private String result;
    private String vaccineName;
    private int studentId;
    private int campaignId;
}
