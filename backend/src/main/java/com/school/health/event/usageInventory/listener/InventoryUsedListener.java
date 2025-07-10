package com.school.health.event.usageInventory.listener;

import com.school.health.dto.request.InventoryUsedInMedicalEventRequestDTO;
import com.school.health.dto.request.InventoryUsedRequestDTO;
import com.school.health.entity.InventoryUsedLog;
import com.school.health.event.usageInventory.InventoryUsedEvent;
import com.school.health.repository.InventoryUsedRepo;
import com.school.health.service.impl.InventoryUsedServiceImpl;
import jakarta.persistence.OneToMany;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class InventoryUsedListener {

    private final InventoryUsedServiceImpl inventoryUsedService;
    private final InventoryUsedRepo inventoryUsedRepo;

    @EventListener
    public void handleInventoryUsedEvent(InventoryUsedEvent event){
        try {
            InventoryUsedInMedicalEventRequestDTO reqDTO = event.getRequest();
            Integer id = event.getEventID();
            System.out.println("=== HANDLING INVENTORY USED EVENT (LEGACY) ===");
            System.out.println("Event ID: " + id);
            System.out.println("Request DTO: " + reqDTO);
            
            // Note: This is now handled directly in the main service method
            // This event listener is kept for backward compatibility
            inventoryUsedService.createInventoryUsedInMedicalEvent(id, reqDTO);
            
            System.out.println("Successfully handled inventory used event");
        } catch (Exception e) {
            System.err.println("Error handling inventory used event: " + e.getMessage());
            e.printStackTrace();
            // Don't rethrow to avoid affecting the main transaction
        }
    }
}
