package com.school.health.enums;

public enum SeverityLevel {
    MINOR("Nhẹ"),
    MODERATE("Trung bình"),
    SERIOUS("Nặng"),
    CRITICAL("Cấp cứu");

    private final String displayName;

    SeverityLevel(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
