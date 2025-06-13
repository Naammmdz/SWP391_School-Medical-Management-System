package com.school.health.dto.response;

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
    private LocalDate date;
    private String eyesight;
    private String hearing;
    private double height;
    private double weight;
    private String notes;
    private boolean parentConfirmation;
    private int studentId;
    private int campaignId;
}

