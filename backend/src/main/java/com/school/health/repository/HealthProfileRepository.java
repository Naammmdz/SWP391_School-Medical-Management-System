package com.school.health.repository;

import com.school.health.entity.HealthProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HealthProfileRepository extends JpaRepository<HealthProfile, Integer> {

    // Tìm hồ sơ theo student ID
    Optional<HealthProfile> findByStudentStudentId(Integer studentId);

    // Tìm học sinh có dị ứng
    @Query("SELECT h FROM HealthProfile h WHERE h.allergies IS NOT NULL AND h.allergies != ''")
    List<HealthProfile> findProfilesWithAllergies();

    // Tìm học sinh có bệnh mãn tính
    @Query("SELECT h FROM HealthProfile h WHERE h.chronicDiseases IS NOT NULL AND h.chronicDiseases != ''")
    List<HealthProfile> findProfilesWithChronicDiseases();

    // Tìm theo nhóm máu
    List<HealthProfile> findByBloodType(String bloodType);

    // Tìm hồ sơ cần cập nhật (chưa cập nhật trong 6 tháng)
    @Query("SELECT h FROM HealthProfile h WHERE h.updatedAt < :cutoffDate")
    List<HealthProfile> findProfilesNeedingUpdate(@Param("cutoffDate") java.time.LocalDateTime cutoffDate);
}