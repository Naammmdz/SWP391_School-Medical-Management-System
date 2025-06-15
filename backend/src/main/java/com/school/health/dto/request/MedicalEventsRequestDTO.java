package com.school.health.dto.request;

import lombok.Data;

import java.time.LocalDateTime;
@Data
public class MedicalEventsRequestDTO {
    private int stuId;
    private String eventType;
    private String description;
    private LocalDateTime createdAt;
    //    private int createdBy;
    private String relatedMedicinesUsed;
    private String notes;

}
