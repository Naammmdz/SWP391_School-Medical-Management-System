package com.school.health.event.noti;

import com.school.health.entity.MedicalEvent;

public class MedicalEventNotificationEvent {
    private MedicalEvent medicalEvent;
    public MedicalEventNotificationEvent(MedicalEvent medicalEvent) {
        this.medicalEvent = medicalEvent;
    }
    public MedicalEvent getMedicalEvent() {
        return medicalEvent;
    }
}

