package com.school.health.event.noti;

import com.school.health.entity.MedicineSubmission;

public class MedicineSubmissionApprovedEvent {
    private MedicineSubmission medicineSubmission;

    public MedicineSubmissionApprovedEvent(MedicineSubmission medicineSubmission) {
        this.medicineSubmission = medicineSubmission;
    }

    public MedicineSubmission getMedicineSubmission() {
        return medicineSubmission;
    }
}
