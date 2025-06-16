package com.school.health.service;

import com.school.health.dto.request.InventoryUsedRequestDTO;
import com.school.health.dto.response.InventoryUsedResponseDTO;
import com.school.health.entity.InventoryUsedLog;

public interface InventoryUsedLogService {
    public InventoryUsedResponseDTO createInventoryUsed(Integer id,InventoryUsedRequestDTO inventoryUsedRequestDTO);
    public InventoryUsedResponseDTO mapDTO(InventoryUsedLog inventoryUsedLog);
}
