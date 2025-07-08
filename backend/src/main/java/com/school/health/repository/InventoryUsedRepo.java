package com.school.health.repository;
import com.school.health.entity.InventoryUsedLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InventoryUsedRepo extends JpaRepository<InventoryUsedLog, Integer> {
        @Query("Select i from InventoryUsedLog i where i.relatedEvent.id = :idEvent")
       public List<InventoryUsedLog> findByEvent(Integer idEvent);
}
