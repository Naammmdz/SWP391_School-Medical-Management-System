package com.school.health.event.listener;

import com.school.health.entity.HealthCheckCampaign;
import com.school.health.entity.VaccinationCampaign;
import com.school.health.event.HealthCheckCampaignCreatedEvent;
import com.school.health.event.VaccinationCampaignCreatedEvent;
import com.school.health.repository.UserRepository;
import com.school.health.service.impl.NotificationServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CampaignCreatedEventListener {
    private final NotificationServiceImpl notificationService;
    private final UserRepository userRepository;

    @EventListener
    public void handleCampaignCreatedEvent(HealthCheckCampaignCreatedEvent event) {
        HealthCheckCampaign campaign = event.getCampaign();
        int userId = userRepository.findPrincipal().getUserId();

        String title = "[Yêu cầu phê duyệt] Chiến dịch kiểm tra sức khỏe: " + campaign.getCampaignName();
        String content = "Kính gửi Thầy/Cô Hiệu trưởng,\n\n"
                + "Hiện tại có một chiến dịch kiểm tra sức khỏe học đường đang chờ phê duyệt với các thông tin như sau:\n\n"
                + "Tên chiến dịch: " + campaign.getCampaignName() + "\n"
                + "Đơn vị tổ chức: " + campaign.getOrganizer() + "\n"
                + "Đối tượng mục tiêu: " + campaign.getTargetGroup() + "\n"
                + "Thời gian dự kiến: " + campaign.getScheduledDate() + "\n"
                + "Địa điểm: " + campaign.getAddress() + "\n"
                + "Mô tả: " + campaign.getDescription() + "\n\n"
                + "Thầy/Cô vui lòng xem xét và thực hiện phê duyệt hoặc từ chối chiến dịch này trên hệ thống.\n\n"
                + "Trân trọng,\nHệ thống Y tế học đường";

        notificationService.createNotification(userId, title, content);
    }


    @EventListener
    public void handleCampaignCreatedEvent(VaccinationCampaignCreatedEvent event) {
        VaccinationCampaign campaign = event.getCampaign();
        int userId = userRepository.findPrincipal().getUserId();

        String title = "[Yêu cầu phê duyệt] Chiến dịch kiểm tra sức khỏe: " + campaign.getCampaignName();
        String content = "Kính gửi Thầy/Cô Hiệu trưởng,\n\n"
                + "Hiện tại có một chiến dịch kiểm tra sức khỏe học đường đang chờ phê duyệt với các thông tin như sau:\n\n"
                + "Tên chiến dịch: " + campaign.getCampaignName() + "\n"
                + "Đơn vị tổ chức: " + campaign.getOrganizer() + "\n"
                + "Đối tượng mục tiêu: " + campaign.getTargetGroup() + "\n"
                + "Thời gian dự kiến: " + campaign.getScheduledDate() + "\n"
                + "Địa điểm: " + campaign.getAddress() + "\n"
                + "Mô tả: " + campaign.getDescription() + "\n\n"
                + "Thầy/Cô vui lòng xem xét và thực hiện phê duyệt hoặc từ chối chiến dịch này trên hệ thống.\n\n"
                + "Trân trọng,\nHệ thống Y tế học đường";
        notificationService.createNotification(userId, title, content);
    }

}
