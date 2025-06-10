package com.school.health.repository;

import com.school.health.entity.MedicineDetail;
import com.school.health.entity.MedicineLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MedicineLogRepository extends JpaRepository<MedicineLog, Integer> {
}
