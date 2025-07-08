package com.school.health.enums;

public enum MedicalEventStatus {
    PROCESSING("Đang xử lý"),
    RESOLVED("Đã xử lý");

    private final String displayName;

    MedicalEventStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}