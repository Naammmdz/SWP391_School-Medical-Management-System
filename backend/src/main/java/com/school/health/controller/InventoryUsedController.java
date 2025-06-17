package com.school.health.controller;

import com.school.health.dto.request.InventoryUsedRequestDTO;
import com.school.health.dto.response.InventoryUsedResponseDTO;
import com.school.health.service.impl.InventoryUsedServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@PreAuthorize("hasRole('NURSE') or hasRole('ADMIN')")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@RequestMapping("/api/inventory")
public class InventoryUsedController {
    @Autowired private InventoryUsedServiceImpl inventoryUsedService;
    // Tạo ra cái Inventory nào đã được sử dụng
    @PostMapping("/items/{itemId}/usage")
    public ResponseEntity<InventoryUsedResponseDTO> addInventoryUsedLog(@PathVariable int itemId, @RequestBody InventoryUsedRequestDTO requestDTO) {
        return ResponseEntity.ok(inventoryUsedService.createInventoryUsed(itemId, requestDTO));
    }
}
