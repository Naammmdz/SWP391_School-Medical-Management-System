package com.school.health.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
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
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate scheduledDate;
    private Status status;
    private boolean AcceptOrNot;
}
