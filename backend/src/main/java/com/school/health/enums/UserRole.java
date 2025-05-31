package com.school.health.enums;

public enum UserRole {
    PARENT("Parent"),
    NURSE("Nurse"),
    MANAGER("Manager"),
    ADMIN("Admin");

    private final String displayName;

    UserRole(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}