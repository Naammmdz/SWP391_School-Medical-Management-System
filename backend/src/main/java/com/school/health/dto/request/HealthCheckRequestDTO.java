package com.school.health.dto.request;

import java.time.LocalDate;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HealthCheckRequestDTO {
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
