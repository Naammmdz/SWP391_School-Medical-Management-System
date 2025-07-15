package com.school.health.service.impl;

import com.school.health.dto.request.InventoryUsedInMedicalEventRequestDTO;
import com.school.health.dto.request.InventoryUsedInMedicalEventUpdateRequestDTO;
import com.school.health.dto.request.InventoryUsedRequestDTO;
import com.school.health.dto.request.InventoryUsedUpdateRequestDTO;
import com.school.health.dto.response.InventoryUsedResponseDTO;
import com.school.health.entity.Inventory;
import com.school.health.entity.InventoryUsedLog;

import com.school.health.event.noti.LowStockInventoryEvent;
import com.school.health.exception.ResourceNotFoundException;
import com.school.health.repository.InventoryRepo;
import com.school.health.repository.InventoryUsedRepo;
import com.school.health.repository.MedicalEventsRepository;

import com.school.health.service.InventoryUsedLogService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class InventoryUsedServiceImpl implements InventoryUsedLogService {

    @Autowired
    private InventoryRepo inventoryRepo;
    @Autowired
    private MedicalEventsRepository medicalEventsRepo;
    @Autowired
    private InventoryUsedRepo inventoryUsedRepo;
    @Autowired
    private ApplicationEventPublisher publisher;
    @Override

    public InventoryUsedResponseDTO createInventoryUsed(Integer itemId, InventoryUsedRequestDTO DTO) {
        InventoryUsedLog inventoryUsedLog = new InventoryUsedLog();
        inventoryUsedLog.setItem(inventoryRepo.findById(itemId).get());
        inventoryUsedLog.setQuantityUsed(DTO.getQuantityUsed());
        inventoryUsedLog.setRelatedEvent(medicalEventsRepo.getReferenceById(DTO.getRelatedEventId()));
        inventoryUsedLog.setNotes(DTO.getNotes());
        updateInventoryItem(itemId,DTO.getQuantityUsed());
        inventoryUsedRepo.save(inventoryUsedLog);
        return mapDTO(inventoryUsedLog);

    }
    @Override
    @Transactional
    public InventoryUsedResponseDTO createInventoryUsedInMedicalEvent(Integer evenID,InventoryUsedInMedicalEventRequestDTO DTO) {
        try {
            System.out.println("=== CREATING INVENTORY USED LOG ===");
            System.out.println("Event ID: " + evenID);
            System.out.println("Item ID: " + DTO.getItemId());
            System.out.println("Quantity Used: " + DTO.getQuantityUsed());
            
            InventoryUsedLog inventoryUsedLog = new InventoryUsedLog();
            inventoryUsedLog.setItem(inventoryRepo.getReferenceById(DTO.getItemId()));
            inventoryUsedLog.setQuantityUsed(DTO.getQuantityUsed());
            inventoryUsedLog.setRelatedEvent(medicalEventsRepo.getReferenceById(evenID));
            inventoryUsedLog.setNotes(DTO.getNotes());
            
            // Update inventory quantity first
            updateInventoryItem(DTO.getItemId(), DTO.getQuantityUsed());
            
            // Save the usage log
            InventoryUsedLog savedLog = inventoryUsedRepo.save(inventoryUsedLog);
            System.out.println("Inventory used log created with ID: " + savedLog.getId());
            
            return mapDTO(savedLog);
        } catch (Exception e) {
            System.err.println("Error creating inventory used log: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to create inventory used log: " + e.getMessage(), e);
        }
    }
    public InventoryUsedResponseDTO InventoryUsedInMedicalEvent(Integer evenID, InventoryUsedInMedicalEventUpdateRequestDTO DTO) {
        InventoryUsedLog inventoryUsedLog = new InventoryUsedLog();
        inventoryUsedLog.setItem(inventoryRepo.findById(DTO.getItemId()).get());
        inventoryUsedLog.setQuantityUsed(DTO.getQuantityUsed());
        inventoryUsedLog.setRelatedEvent(medicalEventsRepo.findById(evenID).orElseThrow());
        inventoryUsedLog.setNotes(DTO.getNotes());
        inventoryUsedLog.setId(DTO.getId());
        updateInventoryItem(DTO.getItemId(),DTO.getQuantityUsed());
        inventoryUsedRepo.save(inventoryUsedLog);
        return mapDTO(inventoryUsedLog);

    }


    @Override
    public InventoryUsedResponseDTO mapDTO(InventoryUsedLog inventoryUsedLog) {
        InventoryUsedResponseDTO DTO = new InventoryUsedResponseDTO();
        DTO.setId(inventoryUsedLog.getId());
        DTO.setItemId(inventoryUsedLog.getItem().getId());
        DTO.setQuantitUsed(inventoryUsedLog.getQuantityUsed());
        DTO.setUsedAt(inventoryUsedLog.getUsedAt());
        DTO.setRelatedEvenId(inventoryUsedLog.getRelatedEvent().getId());
        DTO.setNotes(inventoryUsedLog.getNotes());
        return DTO;
    }

    //Cập nhật lại cái vật  tư đã dùng
    @Override
    public InventoryUsedResponseDTO updateInventoryUsed(Integer inventoryUsedId, InventoryUsedUpdateRequestDTO dto) {

        InventoryUsedLog log = inventoryUsedRepo.findById(inventoryUsedId)
                .orElseThrow(() -> new ResourceNotFoundException("InventoryUsedLog not found"));
        // trước khi cập nhật trả lại kho rồi trừ lại sau
        //
        backUpdateInventoryItem(log.getItem().getId(),log.getQuantityUsed());
        // Cập nhật vật tư nếu có
        if (dto.getItemId() != null) {
            Inventory item = inventoryRepo.findById(dto.getItemId())
                    .orElseThrow(() -> new ResourceNotFoundException("Inventory not found"));
            log.setItem(item);
        }

        // Cập nhật số lượng nếu có
        if (dto.getQuantityUsed() != null && dto.getQuantityUsed() > 0) {
            log.setQuantityUsed(dto.getQuantityUsed());
        }

        // Cập nhật sự kiện y tế nếu có
        if (dto.getRelatedEventId() != null) {
            log.setRelatedEvent(medicalEventsRepo.getReferenceById(dto.getRelatedEventId()));

        }

        // Cập nhật ghi chú nếu có
        if (dto.getNotes() != null && !dto.getNotes().isBlank()) {
            log.setNotes(dto.getNotes());
        }

        inventoryUsedRepo.save(log);
        updateInventoryItem(dto.getItemId(),dto.getQuantityUsed());


        // Trả về DTO phản hồi
        return mapDTO(log);
    }



//Update số lượng trong kho sau khi dùng
    public Inventory updateInventoryItem(Integer itemId, Integer quantityUsed) {
        Inventory item = inventoryRepo.findById(itemId).orElseThrow(() -> new ResourceNotFoundException("Item Not Found"));

        if (quantityUsed > item.getQuantity()) {
            throw new IllegalArgumentException("Số lượng sử dụng vượt quá tồn kho");
        }
        item.setQuantity(item.getQuantity() - quantityUsed);
        // Nếu như item sau khi dùng mà ít hơn mức minStock thì gửi Event thông báo
        if(item.getQuantity()<=item.getMinStockLevel()){
            publisher.publishEvent(new LowStockInventoryEvent(item));
        }
        return inventoryRepo.save(item);
    }

    // cập nhật lại số lượng trong kho trước khi trừ để trừ cái mới
    public Inventory backUpdateInventoryItem(Integer itemId, Integer quantityUsed) {
        Inventory item = inventoryRepo.findById(itemId).orElseThrow(() -> new ResourceNotFoundException("Item Not Found"));
       item.setQuantity(item.getQuantity() + quantityUsed);
        return inventoryRepo.save(item);
    }

    public void deleteInventoryUsed(Integer inventoryUsedId) {
       InventoryUsedLog iUsed =  inventoryUsedRepo.findById(inventoryUsedId).orElseThrow(() -> new ResourceNotFoundException("InventoryUsedLog not found"));
        backUpdateInventoryItem(iUsed.getItem().getId(),iUsed.getQuantityUsed());
        inventoryUsedRepo.deleteById(inventoryUsedId);
    }
}
