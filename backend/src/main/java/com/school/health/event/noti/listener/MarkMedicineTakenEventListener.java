package com.school.health.event.noti.listener;

import com.school.health.dto.response.MedicineLogResponse;
import com.school.health.entity.MedicineSubmission;
import com.school.health.event.noti.MarkMedicineTakenEvent;
import com.school.health.repository.MedicineSubmissionRepository;
import com.school.health.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class MarkMedicineTakenEventListener {

    private final NotificationService notificationService;
    private final MedicineSubmissionRepository medicineSubmissionRepository;

    @EventListener
    public void handleMarkMedicineTakenEvent(MarkMedicineTakenEvent event) {
        MedicineLogResponse medicineLog = event.getMedicineLog();
        //Tìm MedicineSubmission để tìm phụ huynh gửi
        MedicineSubmission medicineSubmission = medicineSubmissionRepository.getReferenceById(medicineLog.getSubmissionId());
        int toUserID = medicineSubmission.getParent().getUserId();
        String title = "Kính gửi Phụ huynh,\n";
        String message = "Nhà trường xin thông báo: con của quý phụ huynh đã được cán bộ y tế tên "+ medicineLog.getGivenByName() +" cho uống thuốc vào lúc "+ medicineLog.getGivenAt() +", theo đúng loại và liều lượng quý phụ huynh đã gửi.\n" +
                "\n" +
                "Trân trọng,\n" +
                "Nhà trường.";
        notificationService.createNotification(toUserID, title, message );
    }
}
