package com.school.health.event;

import com.school.health.entity.MedicineLog;

public class MarkMedicineTakenEvent {
    private MedicineLog medicineLog;
    public MarkMedicineTakenEvent(MedicineLog medicineLog) {
        this.medicineLog = medicineLog;
    }
    public MedicineLog getMedicineLog() {
        return medicineLog;
    }
}
