package com.school.health.event.noti.listener;

import com.school.health.entity.MedicalEvent;
import com.school.health.event.noti.MedicalEventNotificationEvent;
import com.school.health.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class MedicalEventNotificationEventListener {

    private final NotificationService notificationService;
    private MedicalEvent medicalEvent;

    @EventListener
    public void handleMedicalEvent(MedicalEventNotificationEvent event) {
        medicalEvent = event.getMedicalEvent();
        medicalEvent.getStudentList().forEach(student -> {

            int toUserID = student.getParent().getUserId();
            String title = "THÔNG BÁO THĂM KHÁM Y TẾ CÁ NHÂN";
            String message = "Kính gửi Quý Phụ huynh học sinh\n" +
                    "Em: "+student.getFullName()+" – Lớp: "+student.getClassName()+"\n" +
                    "\n" +
                    "Vào thời điểm: " + medicalEvent.getEventDate().getHour() + " giờ "
                    + medicalEvent.getEventDate().getMinute() + " phút, ngày "
                    + medicalEvent.getEventDate().getDayOfMonth() + " tháng "
                    + medicalEvent.getEventDate().getMonthValue() + " năm "
                    + medicalEvent.getEventDate().getYear()
                    + ", em đã bị "+medicalEvent.getEventType()+" trong thời gian học tại trường." +
                    "\n Sau khi được khám sơ bộ thì nhân viên y tế đánh giá chung trình trạng sức khỏe của học sinh như sau: ";
            message += medicalEvent.getSeverityLevel() + " – " + medicalEvent.getDescription() + ".\n" +
                    "\n" +
                    "Hướng xử lý ban đầu:\n" + medicalEvent.getHandlingMeasures() + "\n";
            message += "\n" +
                    "Chúng tôi kính mong Quý Phụ huynh lưu tâm, theo dõi sức khỏe của em tại nhà và phối hợp cùng Nhà trường trong các bước chăm sóc tiếp theo nếu cần thiết.\n" +
                    "\n" +
                    "Trân trọng,\n" +
                    "Nhân viên y tế trường";
            notificationService.createNotification(toUserID, title, message);

        });

    }
}
