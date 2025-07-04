package com.school.health.event.usageInventory.listener;

import com.school.health.dto.request.InventoryUsedInMedicalEventRequestDTO;
import com.school.health.dto.request.InventoryUsedInMedicalEventUpdateRequestDTO;
import com.school.health.event.usageInventory.InventoryUsedEvent;
import com.school.health.event.usageInventory.InventoryUsedUpdateEvent;
import com.school.health.service.impl.InventoryUsedServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class InventoryUsedUpdateListener {

    private final InventoryUsedServiceImpl inventoryUsedService;
    @EventListener
    public void handleInventoryUsedEvent(InventoryUsedUpdateEvent event){
        InventoryUsedInMedicalEventUpdateRequestDTO reqDTO = event.getRequest();
        Integer id = event.getEventID();
//        inventoryUsedService.createInventoryUsedInMedicalEvent(id, reqDTO);
    }
}
