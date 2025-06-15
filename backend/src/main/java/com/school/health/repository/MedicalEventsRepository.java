package com.school.health.repository;

import com.school.health.dto.request.MedicalEventsFiltersRequestDTO;
import com.school.health.entity.MedicalEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MedicalEventsRepository extends JpaRepository<MedicalEvent, Integer> {
    //GetMedicalEvents having filter
    @Query("""
    SELECT m FROM MedicalEvent m
    WHERE 
        (:from IS NULL OR :to IS NULL OR m.createdAt BETWEEN :from AND :to)
      AND (:eventType IS NULL OR m.eventType LIKE CONCAT('%', :eventType, '%'))
      AND (:stuId IS NULL OR m.student.studentId= :stuId)
      AND (:createBy IS NULL OR m.createdBy.userId = :createBy)
    """)
    List<MedicalEvent> findByFilter(LocalDateTime from, LocalDateTime to,String eventType, Integer stuId, Integer createBy);

}
