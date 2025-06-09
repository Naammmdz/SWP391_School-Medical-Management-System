package com.school.health.dto.response;

import com.school.health.enums.Status;
import lombok.*;


import java.time.LocalDate;
import java.time.LocalDateTime;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HealthCampaignResponseDTO {
    private int campaignId;
    private String campaignName;
    private String description;
    private LocalDate scheduledDate;
    private int createdBy;
    private int approvedBy;
    private LocalDateTime approvedAt;
    private Status status;
    private LocalDateTime createdAt;
}
