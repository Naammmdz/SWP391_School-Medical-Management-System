package com.school.health.dto.response;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HealthCheckResponseDTO {
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
}

