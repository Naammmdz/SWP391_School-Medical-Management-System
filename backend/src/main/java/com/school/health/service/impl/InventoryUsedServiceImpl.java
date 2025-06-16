package com.school.health.service.impl;

import com.school.health.dto.request.InventoryRequestDTO;
import com.school.health.dto.request.InventoryUsedRequestDTO;
import com.school.health.dto.response.InventoryResponseDTO;
import com.school.health.dto.response.InventoryUsedResponseDTO;
import com.school.health.entity.Inventory;
import com.school.health.entity.InventoryUsedLog;
import com.school.health.entity.User;
import com.school.health.exception.ResourceNotFoundException;
import com.school.health.repository.InventoryRepo;
import com.school.health.repository.InventoryUsedRepo;
import com.school.health.repository.MedicalEventsRepository;
import com.school.health.repository.UserRepository;
import com.school.health.service.InventoryUsedLogService;
import com.school.health.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InventoryUsedServiceImpl implements InventoryUsedLogService {

    @Autowired
    private InventoryRepo inventoryRepo;
    @Autowired
    private MedicalEventsRepository medicalEventsRepo;
    @Autowired
    private InventoryUsedRepo inventoryUsedRepo;
    @Autowired
    private NotificationService notificationService;
    @Autowired
    private UserRepository userRepo;
    @Override

    public InventoryUsedResponseDTO createInventoryUsed(Integer id, InventoryUsedRequestDTO DTO) {
        InventoryUsedLog inventoryUsedLog = new InventoryUsedLog();
        inventoryUsedLog.setItem(inventoryRepo.findById(id).get());
        inventoryUsedLog.setQuantityUsed(DTO.getQuantityUsed());
        inventoryUsedLog.setRelatedEvent(medicalEventsRepo.getReferenceById(DTO.getRelatedEvenId()));
        inventoryUsedLog.setNotes(DTO.getNotes());
        updateInventoryItem(id,DTO);
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

    public Inventory updateInventoryItem(Integer id, InventoryUsedRequestDTO dto) {
        Inventory item = inventoryRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Item Not Found"));

        if (dto.getQuantityUsed()> item.getQuantity()) {
            throw new IllegalArgumentException("Số lượng sử dụng vượt quá tồn kho");
        }

        item.setQuantity(item.getQuantity() - dto.getQuantityUsed());
        if(item.getQuantity()<=item.getMinStockLevel()){
           List<User> users = userRepo.findAllAdminAndNurse();
            users.forEach(user -> {
                notificationService.createNotification(user.getUserId(),"Vật phẩm/thuốc trong kho đang sắp hết",item.getName() +" đang sắp hết trong kho, vui lòng nhập thêm hàng để tránh việc thiếu sót vật tư khi xử lí các sự kiện y tế!!");
            });
        }
        return inventoryRepo.save(item);
    }

}
