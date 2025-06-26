package com.school.health.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.Column;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HealthCheckResponseResultDTO {
    private int healthCheckId;
    private LocalDate date;
    private double height;
    private double weight;
    private String eyesightLeft;
    private String eyesightRight;
    private String bloodPressure;
    private String hearingLeft;
    private String hearingRight;
    private String temperature;
    private boolean consultationAppointment;
    private String notes;
    private boolean parentConfirmation;
    private int studentId;
    private int campaignId;

    private String campaignName;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate scheduledDate;

}

