package com.school.health.event;

import com.school.health.entity.MedicalEvent;

public class MedicalEventPendingConfirmationEvent {
    private MedicalEvent medicalEvent;
    public MedicalEventPendingConfirmationEvent(MedicalEvent medicalEvent) {
        this.medicalEvent = medicalEvent;
    }
    public MedicalEvent getMedicalEvent() {
        return medicalEvent;
    }
}

