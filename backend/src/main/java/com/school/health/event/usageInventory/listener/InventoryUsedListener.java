package com.school.health.event.usageInventory.listener;

import com.school.health.dto.request.InventoryUsedInMedicalEventRequestDTO;
import com.school.health.dto.request.InventoryUsedRequestDTO;
import com.school.health.entity.InventoryUsedLog;
import com.school.health.event.usageInventory.InventoryUsedEvent;
import com.school.health.repository.InventoryUsedRepo;
import com.school.health.service.impl.InventoryUsedServiceImpl;
import jakarta.persistence.OneToMany;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class InventoryUsedListener {

    private final InventoryUsedServiceImpl inventoryUsedService;
    public void handleInventoryUsedEvent(InventoryUsedEvent event){
        InventoryUsedInMedicalEventRequestDTO reqDTO = event.getRequest();
        Integer id = event.getEventID();
        inventoryUsedService.createInventoryUsedInMedicalEvent(id, reqDTO);
    }
}
