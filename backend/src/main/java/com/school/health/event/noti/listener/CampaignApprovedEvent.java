package com.school.health.event.noti.listener;
import com.school.health.entity.HealthCheckCampaign;
import com.school.health.entity.Student;
import com.school.health.entity.VaccinationCampaign;
import com.school.health.event.noti.HealthCheckCampaignApprovedEvent;
import com.school.health.event.noti.VaccinationCampaignApprovedEvent;
import com.school.health.repository.StudentRepository;
import com.school.health.repository.UserRepository;
import com.school.health.service.impl.NotificationServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class CampaignApprovedEvent {
    private final NotificationServiceImpl notificationService;
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;

    @EventListener
    public void handleCampaignApprovedEvent(HealthCheckCampaignApprovedEvent event) {
        HealthCheckCampaign updatedCampaign = event.getCampaign();
        notificationService.createNotification(updatedCampaign.getCreatedBy(), "Chiến dịch: " + updatedCampaign.getCampaignName() + " đã được phê duyệt", "Chiến dịch: " + updatedCampaign.getCampaignName() + " đã được phê duyệt bởi " + userRepository.findByUserId(updatedCampaign.getApprovedBy()).orElseThrow().getFullName() + " vui lòng kiểm tra!");
        //Gửi noti đến người dùng có con trong target group
        String[] targetGroup = updatedCampaign.getTargetGroup().split(",");
        for (String group : targetGroup) {
            group = group.trim();
            if (group.length() == 1) {
                List<Student> studentList = studentRepository.findByGrade(group);
                for (Student student : studentList) {
                    notificationService.createNotification(student.getParent().getUserId(), "[THÔNG BÁO] Tổ chức kiểm tra sức khỏe định kỳ cho học sinh", "Kính gửi Quý Phụ huynh,\n" +
                            "\n" +
                            "Nhằm theo dõi tình trạng sức khỏe, phát hiện sớm các vấn đề bất thường và đảm bảo sự phát triển toàn diện của học sinh, nhà trường sẽ phối hợp với cơ sở y tế tổ chức kiểm tra sức khỏe định kỳ cho các em trong thời gian tới.\n" +
                            "\n" +
                            "Thông tin chi tiết như sau:\n" +
                            "\n" +
                            "Thời gian: " + updatedCampaign.getScheduledDate() + "\n" +
                            "\n" +
                            "Địa điểm: " + updatedCampaign.getAddress() + "\n" +
                            "\n" +
                            "Một số thông tin khác: " + updatedCampaign.getDescription() + "\n" +
                            "\n" +
                            "Lưu ý:\n" +
                            "\n" +
                            "Phụ huynh vui lòng nhắc nhở học sinh ăn uống đầy đủ và mặc trang phục gọn gàng.\n" +
                            "Nếu học sinh có tiền sử bệnh lý đặc biệt, xin vui lòng thông báo với GVCN hoặc gửi kèm hồ sơ y tế (nếu có)." + "\n" +
                            "Sự phối hợp của Quý Phụ huynh sẽ góp phần quan trọng vào thành công của chương trình và sức khỏe của các em học sinh.\n" +
                            "Kết quả kiểm tra sẽ được gửi về cho Quý Phụ huynh sau khi hoàn tất nhằm giúp gia đình nắm bắt tình hình sức khỏe của các em."+
                            "\n" +
                            "Trân trọng cảm ơn!\n" +
                            "\n" +
                            "Ban Giám hiệu");
                }
            } else if (group.length() == 2) {
                List<Student> studentList = studentRepository.findByClassName(group);
                for (Student student : studentList) {
                    notificationService.createNotification(student.getParent().getUserId(), "[THÔNG BÁO] Tổ chức kiểm tra sức khỏe định kỳ cho học sinh", "Kính gửi Quý Phụ huynh,\n" +
                            "\n" +
                            "Nhằm theo dõi tình trạng sức khỏe, phát hiện sớm các vấn đề bất thường và đảm bảo sự phát triển toàn diện của học sinh, nhà trường sẽ phối hợp với cơ sở y tế tổ chức kiểm tra sức khỏe định kỳ cho các em trong thời gian tới.\n" +
                            "\n" +
                            "Thông tin chi tiết như sau:\n" +
                            "\n" +
                            "Thời gian: " + updatedCampaign.getScheduledDate() + "\n" +
                            "\n" +
                            "Địa điểm: " + updatedCampaign.getAddress() + "\n" +
                            "\n" +
                            "Một số thông tin khác: " + updatedCampaign.getDescription() + "\n" +
                            "\n" +
                            "Lưu ý:\n" +
                            "\n" +
                            "Phụ huynh vui lòng nhắc nhở học sinh ăn uống đầy đủ và mặc trang phục gọn gàng.\n" +
                            "Nếu học sinh có tiền sử bệnh lý đặc biệt, xin vui lòng thông báo với GVCN hoặc gửi kèm hồ sơ y tế (nếu có)." + "\n" +
                            "Sự phối hợp của Quý Phụ huynh sẽ góp phần quan trọng vào thành công của chương trình và sức khỏe của các em học sinh.\n" +
                            "Kết quả kiểm tra sẽ được gửi về cho Quý Phụ huynh sau khi hoàn tất nhằm giúp gia đình nắm bắt tình hình sức khỏe của các em."+
                            "\n" +
                            "Trân trọng cảm ơn!\n" +
                            "\n" +
                            "Ban Giám hiệu");
                }
            }

        }

    }
    @EventListener
    public void handleCampaignApprovedEvent(VaccinationCampaignApprovedEvent event) {
        VaccinationCampaign updatedCampaign = event.getCampaign();
        notificationService.createNotification(updatedCampaign.getCreatedBy(), "Chiến dịch: " + updatedCampaign.getCampaignName() + " đã được phê duyệt", "Chiến dịch: " + updatedCampaign.getCampaignName() + " đã được phê duyệt bởi " + userRepository.findByUserId(updatedCampaign.getApprovedBy()).orElseThrow().getFullName() + " vui lòng kiểm tra!");
        //Gửi noti đến người dùng có con trong target group
        String[] targetGroup = updatedCampaign.getTargetGroup().split(",");
        for (String group : targetGroup) {
            group = group.trim();
            if (group.length() == 1) {
                List<Student> studentList = studentRepository.findByGrade(group);
                for (Student student : studentList) {
                    notificationService.createNotification(student.getParent().getUserId(), "[THÔNG BÁO] Tổ chức kiểm tra sức khỏe định kỳ cho học sinh", "Kính gửi Quý Phụ huynh,\n" +
                            "\n" +
                            "Nhằm theo dõi tình trạng sức khỏe, phát hiện sớm các vấn đề bất thường và đảm bảo sự phát triển toàn diện của học sinh, nhà trường sẽ phối hợp với cơ sở y tế tổ chức kiểm tra sức khỏe định kỳ cho các em trong thời gian tới.\n" +
                            "\n" +
                            "Thông tin chi tiết như sau:\n" +
                            "\n" +
                            "Thời gian: " + updatedCampaign.getScheduledDate() + "\n" +
                            "\n" +
                            "Địa điểm: " + updatedCampaign.getAddress() + "\n" +
                            "\n" +
                            "Một số thông tin khác: " + updatedCampaign.getDescription() + "\n" +
                            "\n" +
                            "Lưu ý:\n" +
                            "\n" +
                            "Phụ huynh vui lòng nhắc nhở học sinh ăn uống đầy đủ và mặc trang phục gọn gàng.\n" +
                            "Nếu học sinh có tiền sử bệnh lý đặc biệt, xin vui lòng thông báo với GVCN hoặc gửi kèm hồ sơ y tế (nếu có)." + "\n" +
                            "Sự phối hợp của Quý Phụ huynh sẽ góp phần quan trọng vào thành công của chương trình và sức khỏe của các em học sinh.\n" +
                            "Kết quả kiểm tra sẽ được gửi về cho Quý Phụ huynh sau khi hoàn tất nhằm giúp gia đình nắm bắt tình hình sức khỏe của các em." +
                            "\n" +
                            "Trân trọng cảm ơn!\n" +
                            "\n" +
                            "Ban Giám hiệu");
                }
            } else if (group.length() == 2) {
                List<Student> studentList = studentRepository.findByClassName(group);
                for (Student student : studentList) {
                    notificationService.createNotification(student.getParent().getUserId(), "[THÔNG BÁO] Tổ chức kiểm tra sức khỏe định kỳ cho học sinh", "Kính gửi Quý Phụ huynh,\n" +
                            "\n" +
                            "Nhằm theo dõi tình trạng sức khỏe, phát hiện sớm các vấn đề bất thường và đảm bảo sự phát triển toàn diện của học sinh, nhà trường sẽ phối hợp với cơ sở y tế tổ chức kiểm tra sức khỏe định kỳ cho các em trong thời gian tới.\n" +
                            "\n" +
                            "Thông tin chi tiết như sau:\n" +
                            "\n" +
                            "Thời gian: " + updatedCampaign.getScheduledDate() + "\n" +
                            "\n" +
                            "Địa điểm: " + updatedCampaign.getAddress() + "\n" +
                            "\n" +
                            "Một số thông tin khác: " + updatedCampaign.getDescription() + "\n" +
                            "\n" +
                            "Lưu ý:\n" +
                            "\n" +
                            "Phụ huynh vui lòng nhắc nhở học sinh ăn uống đầy đủ và mặc trang phục gọn gàng.\n" +
                            "Nếu học sinh có tiền sử bệnh lý đặc biệt, xin vui lòng thông báo với GVCN hoặc gửi kèm hồ sơ y tế (nếu có)." + "\n" +
                            "Sự phối hợp của Quý Phụ huynh sẽ góp phần quan trọng vào thành công của chương trình và sức khỏe của các em học sinh.\n" +
                            "Kết quả kiểm tra sẽ được gửi về cho Quý Phụ huynh sau khi hoàn tất nhằm giúp gia đình nắm bắt tình hình sức khỏe của các em." +
                            "\n" +
                            "Trân trọng cảm ơn!\n" +
                            "\n" +
                            "Ban Giám hiệu");
                }
            }

        }
    }
}
