package com.school.health.controller;

import com.school.health.dto.request.InventoryRequestDTO;
import com.school.health.dto.response.InventoryResponseDTO;
import com.school.health.entity.Inventory;
import com.school.health.service.InventoryService;
import jakarta.validation.Valid;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@PreAuthorize("hasRole('NURSE') or hasRole('ADMIN')")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@RequestMapping("/api/inventory")
public class InventoryController {
    @Autowired private InventoryService inventoryService;
    //Lấy hết Inventory
    @GetMapping("")
    public ResponseEntity<List<InventoryResponseDTO>> getAllInventory() {
        return ResponseEntity.ok( inventoryService.getAllInventoryItems());

    }
    //create Item (Tạo Inventory)
    @PostMapping ("/items")
    public ResponseEntity<InventoryResponseDTO> createInventory(@RequestBody @Valid InventoryRequestDTO inventoryRequestDTO) {
        return  ResponseEntity.ok( inventoryService.createInventoryItem(inventoryRequestDTO));
    }
    // chỉnh sửa, update Inventory
    @PutMapping  ("/items/{itemId}")
    public ResponseEntity<InventoryResponseDTO> updateInventory(@PathVariable Integer itemId, @RequestBody @Valid InventoryRequestDTO inventoryRequestDTO) {

        return  ResponseEntity.ok( inventoryService.updateInventoryItem(itemId,inventoryRequestDTO));
    }
    // lấy hết các inventory sắp hết trong kho
    @GetMapping ("/low-stock")
    public ResponseEntity<List<InventoryResponseDTO>> getLowStockInventory() {
        return ResponseEntity.ok(inventoryService.getInventoryItemsLowStock());
    }
    // lấy hết các inventory cận date trong kho
    @GetMapping ("/expiring-soon")
    public ResponseEntity<List<InventoryResponseDTO>> getExpiringSoonInventory() {
        return ResponseEntity.ok(inventoryService.getInventoryItemsExpiringSoon());
    }
}
