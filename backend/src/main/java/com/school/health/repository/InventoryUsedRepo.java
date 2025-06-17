package com.school.health.repository;
import com.school.health.entity.InventoryUsedLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InventoryUsedRepo extends JpaRepository<InventoryUsedLog, Integer> {

}
