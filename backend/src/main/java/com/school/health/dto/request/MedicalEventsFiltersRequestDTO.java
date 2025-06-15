package com.school.health.dto.request;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class MedicalEventsFiltersRequestDTO {
    private Integer stuId;
    private String eventType;

    private LocalDateTime  from;
    private LocalDateTime  to;
      private Integer createdBy;


}
