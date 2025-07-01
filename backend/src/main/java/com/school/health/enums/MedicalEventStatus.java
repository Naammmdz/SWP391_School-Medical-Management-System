package com.school.health.enums;

public enum MedicalEventStatus {
    PROCESSING("Đang xử lý"),
    RESOLVED("Đã xử lý"),
    PENDING_CONFIRMATION("Chờ xác nhận");

    private final String displayName;

    MedicalEventStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}