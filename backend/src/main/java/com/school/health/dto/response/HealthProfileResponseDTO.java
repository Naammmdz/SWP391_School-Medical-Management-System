package com.school.health.dto.response;

import com.school.health.entity.HealthProfile;
import lombok.Builder;
import lombok.Data;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class HealthProfileResponseDTO {
    private Integer profileId;
    private Integer studentId;
    private String studentName;
    private String studentClass;
    private String allergies;
    private String chronicDiseases;
    private String treatmentHistory;
    private String eyesight;
    private String hearing;
    private String bloodType;
    private BigDecimal weight;
    private BigDecimal height;
    private String notes;
    private LocalDateTime updatedAt;
}
