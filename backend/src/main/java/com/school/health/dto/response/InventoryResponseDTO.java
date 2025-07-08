package com.school.health.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDate;


    @Data
    public class InventoryResponseDTO {
        private int itemId;
        private String name;
        private String type;
        private String unit;
        private int quantity;

        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
        private LocalDate expiryDate;
        private String createdAt;
    }

