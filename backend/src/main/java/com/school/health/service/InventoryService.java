package com.school.health.service;

import com.school.health.dto.request.InventoryRequestDTO;
import com.school.health.dto.response.InventoryResponseDTO;
import com.school.health.entity.Inventory;

import java.time.LocalDate;
import java.util.List;

public interface InventoryService {
    public List<InventoryResponseDTO> getAllInventoryItems();
    public InventoryResponseDTO mapToDTO(Inventory item) ;
    public InventoryResponseDTO createInventoryItem( InventoryRequestDTO requestDTO);
    public InventoryResponseDTO updateInventoryItem( Integer id, InventoryRequestDTO requestDTO);
    public List<InventoryResponseDTO> getInventoryIntemsLowStock();
    public List<InventoryResponseDTO> getInventoryIntemsExpiringSoon();
}
