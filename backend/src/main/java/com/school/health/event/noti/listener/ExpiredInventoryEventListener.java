package com.school.health.event.noti.listener;

import com.school.health.entity.Inventory;
import com.school.health.entity.User;
import com.school.health.enums.InventoryStatus;
import com.school.health.event.noti.ExpiredInventoryEvent;
import com.school.health.repository.UserRepository;
import com.school.health.service.impl.NotificationServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class ExpiredInventoryEventListener {
    private final NotificationServiceImpl notificationService;
    private final UserRepository userRepository;

    @EventListener
    public void handleExpiredInventory(ExpiredInventoryEvent event){
        List<Inventory> expiredItems = event.getExpiredInventories();
        for (Inventory item : expiredItems) {
            String message = "Mặt hàng '" + item.getName() + "' đã hết hạn sử dụng vào " + item.getExpiryDate();
            List<User> list = userRepository.findAllAdminAndNurse();
            list.forEach(listUser -> { notificationService.createNotification(listUser.getUserId(),"Vật phẩm/thuốc "+item.getName() + " trong kho hết hạn",message);});
            item.setStatus(InventoryStatus.EXPIRED);
        }
    }
}
