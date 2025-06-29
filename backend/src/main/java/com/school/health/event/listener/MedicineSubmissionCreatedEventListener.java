package com.school.health.event.listener;

import com.school.health.entity.MedicineSubmission;
import com.school.health.event.MedicineSubmissionCreatedEvent;
import com.school.health.repository.UserRepository;
import com.school.health.service.impl.NotificationServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class MedicineSubmissionCreatedEventListener {
    private final UserRepository userRepository;
    private final NotificationServiceImpl  notificationService;

    @EventListener
    public void handleCreateMedicineSubmissionEvent(MedicineSubmissionCreatedEvent event) {
        MedicineSubmission medicineSubmission = event.getMedicineSubmission();
        userRepository.findAllNurse().forEach(user -> {
            notificationService.createNotification(user.getUserId(),
                    "Có đơn thuốc chờ bạn xử lí", "Có đơn gửi thuốc từ phụ huynh " + medicineSubmission.getParent().getFullName() + " xin vui lòng kiểm tra");
        });
    }
}
