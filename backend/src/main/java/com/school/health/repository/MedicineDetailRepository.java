package com.school.health.repository;

import com.school.health.entity.MedicineDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MedicineDetailRepository extends JpaRepository<MedicineDetail, Integer> {
}
