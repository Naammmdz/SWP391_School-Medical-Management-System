package com.school.health.dto.response;

import lombok.Data;

import java.time.LocalDate;


    @Data
    public class InventoryResponseDTO {
        private int itemId;
        private String name;
        private String type;
        private String unit;
        private int quantity;
        private LocalDate expiryDate;
        private String createdAt;
    }

