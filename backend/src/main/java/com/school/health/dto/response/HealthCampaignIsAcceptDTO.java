package com.school.health.dto.response;

import com.school.health.enums.Status;
import lombok.*;

import java.time.LocalDate;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HealthCampaignIsAcceptDTO {
    private int campaignId;
    private String campaignName;
    private LocalDate scheduledDate;
    private Status status;
    private boolean AcceptOrNot;
}
