package com.school.health.event.noti;

import com.school.health.dto.response.MedicineLogResponse;

public class MarkMedicineTakenEvent {
    private MedicineLogResponse medicineLog;
    public MarkMedicineTakenEvent(MedicineLogResponse medicineLog) {
        this.medicineLog = medicineLog;
    }
    public MedicineLogResponse getMedicineLog() {
        return medicineLog;
    }
}
