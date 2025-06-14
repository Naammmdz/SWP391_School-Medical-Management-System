package com.school.health.dto.request;

import com.school.health.enums.Status;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.Future;
import lombok.*;

import java.time.LocalDate;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HealthCampaignRequestDTO {
    private String campaignName;
    private String description;
    @Future(message = "NGÀY PHẢI LÀ TƯƠNG LAI")
    private LocalDate scheduledDate;
    @Enumerated(EnumType.STRING)
    @Column(name = "Status")
    private Status status;
}
