package com.school.health.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ChatbotRequest {
    @NotBlank(message = "Message cannot be empty")
    private String message;
}
