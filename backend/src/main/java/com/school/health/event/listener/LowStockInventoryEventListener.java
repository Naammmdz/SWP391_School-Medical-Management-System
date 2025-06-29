package com.school.health.event.listener;

import com.school.health.entity.Inventory;
import com.school.health.entity.User;
import com.school.health.event.LowStockInventoryEvent;
import com.school.health.repository.UserRepository;
import com.school.health.service.impl.NotificationServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.util.List;

@Component

public class LowStockInventoryEventListener {
    @Autowired
    private  NotificationServiceImpl notificationService;
    @Autowired
    UserRepository userRepo;

    @EventListener
    public void handleLowStockInventoryEvent(LowStockInventoryEvent event) {
        Inventory item = event.getInventory();
        List<User> users = userRepo.findAllAdminAndNurse();
        users.forEach(user -> {
            notificationService.createNotification(user.getUserId(),"Vật phẩm/thuốc trong kho đang sắp hết",item.getName() +" đang sắp hết trong kho, vui lòng nhập thêm hàng để tránh việc thiếu sót vật tư khi xử lí các sự kiện y tế!!");
        });
    }

}
