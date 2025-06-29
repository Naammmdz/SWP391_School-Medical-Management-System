package com.school.health.event;

import com.school.health.dto.response.MedicineLogResponse;
import com.school.health.entity.MedicineLog;

public class MarkMedicineTakenEvent {
    private MedicineLogResponse medicineLog;
    public MarkMedicineTakenEvent(MedicineLogResponse medicineLog) {
        this.medicineLog = medicineLog;
    }
    public MedicineLogResponse getMedicineLog() {
        return medicineLog;
    }
}
