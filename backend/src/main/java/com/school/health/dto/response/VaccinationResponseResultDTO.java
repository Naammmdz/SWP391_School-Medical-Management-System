package com.school.health.dto.response;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.Column;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VaccinationResponseResultDTO {
    private int vaccinationId;
    @JsonFormat(pattern = "yyyy-MM-dd")
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

    private String campaignName;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate scheduledDate;
}
