package com.school.health.service.impl;

import com.school.health.dto.request.InventoryUsedRequestDTO;
import com.school.health.dto.request.InventoryUsedUpdateRequestDTO;
import com.school.health.dto.response.InventoryUsedResponseDTO;
import com.school.health.entity.Inventory;
import com.school.health.entity.InventoryUsedLog;

import com.school.health.event.LowStockInventoryEvent;
import com.school.health.exception.ResourceNotFoundException;
import com.school.health.repository.InventoryRepo;
import com.school.health.repository.InventoryUsedRepo;
import com.school.health.repository.MedicalEventsRepository;

import com.school.health.service.InventoryUsedLogService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

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

    public InventoryUsedResponseDTO createInventoryUsed(Integer id, InventoryUsedRequestDTO DTO) {
        InventoryUsedLog inventoryUsedLog = new InventoryUsedLog();
        inventoryUsedLog.setItem(inventoryRepo.findById(id).get());
        inventoryUsedLog.setQuantityUsed(DTO.getQuantityUsed());
        inventoryUsedLog.setRelatedEvent(medicalEventsRepo.getReferenceById(DTO.getRelatedEventId()));
        inventoryUsedLog.setNotes(DTO.getNotes());
        updateInventoryItem(id,DTO.getQuantityUsed());
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

    @Override
    public InventoryUsedResponseDTO updateInventoryUsed(Integer id, InventoryUsedUpdateRequestDTO dto) {
        // Tìm bản ghi cần cập nhật theo ID (bạn cần truyền ID từ DTO hoặc thêm tham số)
        InventoryUsedLog log = inventoryUsedRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("InventoryUsedLog not found"));
        // trước khi cập nhật trả lại kho rồi trừ lại sau
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


    public Inventory updateInventoryItem(Integer id, Integer quantityUsed) {
        Inventory item = inventoryRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Item Not Found"));

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
    public Inventory backUpdateInventoryItem(Integer id, Integer quantityUsed) {
        Inventory item = inventoryRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Item Not Found"));


       item.setQuantity(item.getQuantity() + quantityUsed);
        return inventoryRepo.save(item);
    }


}
