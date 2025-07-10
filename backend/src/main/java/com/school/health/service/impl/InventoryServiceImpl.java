package com.school.health.service.impl;

import com.school.health.dto.request.InventoryRequestDTO;
import com.school.health.dto.response.InventoryResponseDTO;
import com.school.health.entity.Inventory;
import com.school.health.event.noti.ExpiredInventoryEvent;
import com.school.health.exception.ResourceNotFoundException;
import com.school.health.repository.InventoryRepo;
import com.school.health.repository.UserRepository;
import com.school.health.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class InventoryServiceImpl implements InventoryService {
    @Autowired
    private InventoryRepo inventoryRepo;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ApplicationEventPublisher publisher;

    @Override
    public List<InventoryResponseDTO> getAllInventoryItems() {
        List<Inventory> inventoryList = inventoryRepo.findAll();
        return inventoryList.stream().map(inventory -> mapToDTO(inventory)).collect(Collectors.toList());
    }


    @Override
    public InventoryResponseDTO mapToDTO(Inventory item) {
        InventoryResponseDTO dto = new InventoryResponseDTO();
        dto.setItemId(item.getId());
        dto.setName(item.getName());
        dto.setType(item.getType());
        dto.setUnit(item.getUnit());
        dto.setQuantity(item.getQuantity());
        dto.setMinStockLevel(item.getMinStockLevel());
        dto.setExpiryDate(item.getExpiryDate());
        dto.setBatchNumber(item.getBatchNumber());
        dto.setManufacturer(item.getManufacturer());
        dto.setImportDate(item.getImportDate());
        dto.setImportPrice(item.getImportPrice());
        dto.setStorageLocation(item.getStorageLocation());
        dto.setStatus(item.getStatus());
        dto.setSource(item.getSource());
        dto.setCreatedAt(item.getCreatedAt().toString());
        return dto;
    }

    @Override
    public InventoryResponseDTO createInventoryItem(InventoryRequestDTO requestDTO) {
        Inventory inventory = new Inventory();
        inventory.setName(requestDTO.getName());
        inventory.setType(requestDTO.getType());
        inventory.setUnit(requestDTO.getUnit());
        inventory.setQuantity(requestDTO.getQuantity());
        inventory.setMinStockLevel(requestDTO.getMinStockLevel());
        inventory.setExpiryDate(requestDTO.getExpiryDate());
        inventory.setBatchNumber(requestDTO.getBatchNumber());
        inventory.setManufacturer(requestDTO.getManufacturer());
        inventory.setImportDate(requestDTO.getImportDate());
        inventory.setImportPrice(requestDTO.getImportPrice());
        inventory.setStorageLocation(requestDTO.getStorageLocation());
        inventory.setStatus(requestDTO.getStatus());
        inventory.setSource(requestDTO.getSource());
        inventoryRepo.save(inventory);
        return mapToDTO(inventory);
    }

    @Override
    public InventoryResponseDTO updateInventoryItem(Integer id,InventoryRequestDTO dto) {
        Inventory item = inventoryRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Item Not Found"));
        if (dto.getName() != null) item.setName(dto.getName());
        if (dto.getType() != null) item.setType(dto.getType());
        if (dto.getUnit() != null) item.setUnit(dto.getUnit());
        if (dto.getQuantity() != null) item.setQuantity(dto.getQuantity());
        if (dto.getMinStockLevel() != null) item.setMinStockLevel(dto.getMinStockLevel());
        if (dto.getExpiryDate() != null) item.setExpiryDate(dto.getExpiryDate());
        if (dto.getBatchNumber() != null) item.setBatchNumber(dto.getBatchNumber());
        if (dto.getManufacturer() != null) item.setManufacturer(dto.getManufacturer());
        if (dto.getImportDate() != null) item.setImportDate(dto.getImportDate());
        if (dto.getImportPrice() != null) item.setImportPrice(dto.getImportPrice());
        if (dto.getStorageLocation() != null) item.setStorageLocation(dto.getStorageLocation());
        if (dto.getStatus() != null) item.setStatus(dto.getStatus());
        if (dto.getSource() != null) item.setSource(dto.getSource());
        inventoryRepo.save(item);
        return mapToDTO(item);
    }

    @Override
    public List<InventoryResponseDTO> getInventoryItemsLowStock() {
        return inventoryRepo.getAllInventoryLowStock().stream().map(inventory -> mapToDTO(inventory)).collect(Collectors.toList());
    }

    @Override
    public List<InventoryResponseDTO> getInventoryItemsExpiringSoon() {
        LocalDate today = LocalDate.now();
        return inventoryRepo.getInventoryExpiringSoon(today.plusDays(30)).stream().map(inventory -> mapToDTO(inventory)).collect(Collectors.toList());
    }
    // Chạy mỗi ngày lúc 6:30 giờ sáng
    @Scheduled(cron = "0 30 6 * * ?")
    public void checkExpiredInventory() {
        LocalDate today = LocalDate.now();
        List<Inventory> expiredItems = inventoryRepo.findByExpiryDateBefore(today);
        publisher.publishEvent(new ExpiredInventoryEvent( expiredItems));
    }
}
