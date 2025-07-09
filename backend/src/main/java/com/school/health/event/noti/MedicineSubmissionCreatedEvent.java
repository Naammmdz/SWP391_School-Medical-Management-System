package com.school.health.event.noti;

import com.school.health.entity.MedicineSubmission;

public class MedicineSubmissionCreatedEvent {
    private MedicineSubmission medicineSubmission;
    public MedicineSubmissionCreatedEvent(MedicineSubmission medicineSubmission) {
        this.medicineSubmission = medicineSubmission;
    }
    public MedicineSubmission getMedicineSubmission() {
        return medicineSubmission;
    }
}
