package com.school.health.repository;

import com.school.health.entity.HealthCheck;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface HealthCheckRepository extends JpaRepository<HealthCheck, Integer> {
    @Query("SELECT hc FROM HealthCheck hc WHERE hc.campaign.campaignId = :campaignId AND hc.student.studentId = :studentId")
    HealthCheck findByCampaignIdAndStudentId(Integer campaignId, Integer studentId);

    // Đoạn code này dùng JPQL nhá macbook trả ra kết quả dựa theo campaign ID
    @Query("SELECT hc FROM HealthCheck hc WHERE hc.campaign.campaignId = :campaignId AND hc.parentConfirmation = true")
    List<HealthCheck> findByCampaignId(Integer campaignId);

    // Lấy hết các HealthCheck của một học sinh theo studentId
    @Query("SELECT hc FROM HealthCheck hc WHERE hc.student.studentId = :studentId")
    List<HealthCheck> findByStudentId(Integer studentId);

    @Query("SELECT hc FROM HealthCheck hc WHERE :startDate <= hc.date AND hc.date <= :endDate OR hc.consultationAppointment = :consultationAppointment")
    List<HealthCheck> findResultWithDate(LocalDate startDate, LocalDate endDate,boolean consultationAppointment);
}

