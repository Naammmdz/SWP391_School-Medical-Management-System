package com.school.health.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.school.health.enums.Status;
import lombok.*;


import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HealthCampaignResponseDTO {
    private int campaignId;
    private String campaignName;
    private String targetGroup;
    private String type;
    private String address; // địa điểm tổ chức khám
    private String organizer; // người thực hiện chiến dịch
    private String description;
    private LocalDate scheduledDate;
    private int createdBy;
    private int approvedBy;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime approvedAt;
    private Status status;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

}
