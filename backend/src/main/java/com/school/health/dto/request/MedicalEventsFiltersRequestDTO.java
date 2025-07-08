package com.school.health.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.school.health.enums.MedicalEventStatus;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
public class MedicalEventsFiltersRequestDTO {
    private Integer stuId;
    private String eventType;

//    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS")
    private LocalDateTime  from;

//    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS")
    private LocalDateTime  to;
    private Integer createdBy;
    private MedicalEventStatus status;


}
