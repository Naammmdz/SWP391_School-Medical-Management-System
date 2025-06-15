package com.school.health.repository;

import com.school.health.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryRepo extends JpaRepository<Inventory, Integer> {
    Optional<Inventory> findById(int id);

    @Query("Select i from Inventory i where i.id = :id")
    Inventory findInventoryById(int id);
    @Query("Select i from Inventory i where i.quantity <= i.minStockLevel")
    List<Inventory> getAllInventoryLowStock();
    @Query("Select i from Inventory i where i.expiryDate <= :day")
    List<Inventory> getInventoryExpiringSoon(@Param("day") LocalDate a);
    @Query("select i from Inventory i where i.expiryDate <= :date")
    List<Inventory> findByExpiryDateBefore(LocalDate date);
}
