package com.school.health.dto.request;

import java.time.LocalDate;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VaccinationRequestDTO {
    private LocalDate date;
    private String notes;
    private boolean parentConfirmation;
    private String result;
    private String vaccineName;
    private int studentId;
    private int campaignId;
}
