package com.school.health.event.noti.listener;

import com.school.health.entity.MedicineSubmission;
import com.school.health.event.noti.MedicineSubmissionApprovedEvent;
import com.school.health.repository.UserRepository;
import com.school.health.service.impl.NotificationServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class MedicineSubmissionApprovedEventListener {
    private final NotificationServiceImpl notificationService;
    private UserRepository userRepository;

    @EventListener
    public void handleMedicineSubmissionApprovedEvent(MedicineSubmissionApprovedEvent event) {
        MedicineSubmission medicineSubmission = event.getMedicineSubmission();
        String status = medicineSubmission.getSubmissionStatus().toString().equals("APPROVED") ? "chấp nhận" : "từ chối";
        notificationService.createNotification(medicineSubmission.getParent().getUserId(),"Yêu cầu gửi thuốc của bạn đã có kết quả", "Yêu cầu gửi thuốc của bạn đã được "+ status + " bởi "+medicineSubmission.getApprovedBy().getFullName()+" vào "+ medicineSubmission.getApprovedAt());
    }
}
