package com.school.health.event.listener;

import com.school.health.entity.MedicineLog;
import com.school.health.entity.MedicineSubmission;
import com.school.health.event.MarkMedicineTakenEvent;
import com.school.health.repository.MedicalEventsRepository;
import com.school.health.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class MarkMedicineTakenEventListener {

    private final NotificationService notificationService;


    @EventListener
    public void handleMarkMedicineTakenEvent(MarkMedicineTakenEvent event) {
        MedicineLog medicineLog = event.getMedicineLog();
        MedicineSubmission medicineSubmission = medicineLog.getMedicineSubmission();
        int toUserID = medicineSubmission.getParent().getUserId();
        String title = "Kính gửi Phụ huynh,\n";
        String message = "Nhà trường xin thông báo: con của quý phụ huynh đã được cán bộ y tế tên "+ medicineLog.getGivenBy().getFullName()+" cho uống thuốc vào lúc "+ medicineLog.getGivenAt() +", theo đúng loại và liều lượng quý phụ huynh đã gửi.\n" +
                "\n" +
                "Trân trọng,\n" +
                "Nhà trường.";
        notificationService.createNotification(toUserID, title, message );
    }
}
