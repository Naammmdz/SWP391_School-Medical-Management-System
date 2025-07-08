package com.school.health.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDateTime;
@Data
public class InventoryUsedResponseDTO {
    private int id;
    private Integer itemId;
    private Integer quantitUsed;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS")
    private LocalDateTime usedAt;
    private Integer relatedEvenId;
    private String notes;
}
