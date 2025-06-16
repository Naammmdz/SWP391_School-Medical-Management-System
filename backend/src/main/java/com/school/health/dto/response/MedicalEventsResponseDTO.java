package com.school.health.dto.response;

import lombok.Data;

import java.time.LocalDateTime;
@Data
public class MedicalEventsResponseDTO {
    private int id;
    private Integer stuId;
    private String eventType;
    private String description;
    private LocalDateTime createdAt;
    private Integer createdBy;
    private String relatedMedicinesUsed;
    private String notes;

}
