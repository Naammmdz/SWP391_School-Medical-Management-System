package com.school.health.repository;

import com.school.health.dto.request.MedicalEventsFiltersRequestDTO;
import com.school.health.entity.MedicalEvent;
import com.school.health.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface MedicalEventsRepository extends JpaRepository<MedicalEvent, Integer> {
    //GetMedicalEvents having filter
    @Query("""
    SELECT DISTINCT m FROM MedicalEvent m
    JOIN m.studentList s
    WHERE
        (:from IS NULL OR m.createdAt >= :from)
        AND (:to IS NULL OR m.createdAt <= :to)
        AND (:eventType IS NULL OR m.eventType LIKE CONCAT('%', :eventType, '%'))
        AND (:stuId IS NULL OR s.studentId  = :stuId)
        AND (:createBy IS NULL OR m.createdBy.userId = :createBy)
    """)
    List<MedicalEvent> findByFilter(LocalDateTime from, LocalDateTime to, String eventType, Integer stuId, Integer createBy);

    Optional<MedicalEvent> findById(Integer id);

    @Query("SELECT DISTINCT m FROM MedicalEvent m\n" +
            "    JOIN m.studentList s where (:stuId IS NULL OR s.studentId  = :stuId) ")
    List<MedicalEvent> findByStudentId(Integer stuId);

}
