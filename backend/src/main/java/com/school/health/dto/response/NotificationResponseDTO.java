package com.school.health.dto.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class NotificationResponseDTO {
   private String Title;
    private String Message;
    private LocalDateTime DateTime;
}
