package com.school.health.dto.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class NotificationResponseDTO {
    private int  id;
    private int userId;
   private String Title;
    private String Message;
    private Boolean isRead;
    private LocalDateTime createdAt;
}
