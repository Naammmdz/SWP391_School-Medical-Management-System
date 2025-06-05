package com.school.health.enums;

public enum Role {
    PARENT("PARENT"),
    NURSE("NURSE"),
    MANAGER("ADMIN"),
    ADMIN("PRINCIPAL");

    private final String displayName;

    Role(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}