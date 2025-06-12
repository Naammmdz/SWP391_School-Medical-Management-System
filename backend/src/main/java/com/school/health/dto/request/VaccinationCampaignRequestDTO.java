package com.school.health.dto.request;

import com.school.health.enums.Status;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VaccinationCampaignRequestDTO {
    private String campaignName;
    private String description;
    private LocalDate scheduledDate;
    @Enumerated(EnumType.STRING)
    private Status status;
}
