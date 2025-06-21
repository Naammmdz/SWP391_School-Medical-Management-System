package com.school.health.dto.response;

import java.time.LocalDate;

import jakarta.persistence.Column;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VaccinationResponseDTO {
    private int vaccinationId;
    private LocalDate date;
    private Integer doseNumber;
    private String adverseReaction;
    private boolean isPreviousDose;
    private String notes;
    private boolean parentConfirmation;
    private String result;
    private String vaccineName;
    private int studentId;
    private int campaignId;
}
