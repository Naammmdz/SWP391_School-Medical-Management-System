package com.school.health.enums;

public enum UserRole {
    PARENT("PARENT"),
    NURSE("NURSE"),
    MANAGER("ADMIN"),
    ADMIN("PRINCIPAL");

    private final String displayName;

    UserRole(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}