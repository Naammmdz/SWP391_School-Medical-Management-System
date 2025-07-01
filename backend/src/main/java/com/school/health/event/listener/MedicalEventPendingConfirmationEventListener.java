package com.school.health.event.listener;

import com.school.health.entity.MedicalEvent;
import com.school.health.event.MedicalEventPendingConfirmationEvent;
import com.school.health.service.NotificationService;
import jakarta.persistence.Enumerated;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class MedicalEventPendingConfirmationEventListener {

    private final NotificationService notificationService;
    private MedicalEvent medicalEvent;

    @EventListener
    public void handleMedicalEventPendingConfirmation(MedicalEventPendingConfirmationEvent event) {
        medicalEvent = event.getMedicalEvent();
        int toUserID = medicalEvent.getStudent().getParent().getUserId();
        String title = "THÔNG BÁO & XIN XÁC NHẬN THĂM KHÁM Y TẾ CÁ NHÂN";
        String message = "Kính gửi Quý Phụ huynh học sinh\n" +
                "Em: [Họ và tên học sinh] – Lớp: [Tên lớp]\n" +
                "\n" +
                "Vào thời điểm: " + medicalEvent.getEventDate().getHour() + " giờ "
                + medicalEvent.getEventDate().getMinute() + " phút, ngày "
                + medicalEvent.getEventDate().getDayOfMonth() + " tháng "
                + medicalEvent.getEventDate().getMonthValue() + " năm "
                + medicalEvent.getEventDate().getYear()
                + ", em có dấu hiệu bị chấn thương tại vùng kín trong thời gian học tại trường. Nhằm đảm bảo an toàn sức khỏe cho em và kịp thời phát hiện, xử lý tình trạng bất thường (nếu có), nhân viên y tế của trường kính đề nghị được phép:"
                +
                "\n" +
                "Thăm khám sơ bộ vùng tổn thương (cơ quan sinh dục ngoài) cho học sinh.\n" +
                "\n" +
                "Việc thăm khám sẽ được thực hiện:\n" +
                "\n" +
                "Trong phòng y tế, đảm bảo riêng tư và tôn trọng học sinh.\n" +
                "\n" +
                "Chỉ thực hiện khi có sự đồng ý rõ ràng bằng văn bản của phụ huynh/người giám hộ.";
        notificationService.createNotification(toUserID, title, message);
    }
}
