package com.school.health.repository;

import com.school.health.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface HealthCheckRepository extends JpaRepository<HealthCheck, Integer>, JpaSpecificationExecutor<HealthCheck> {
    @Query("SELECT hc FROM HealthCheck hc WHERE hc.campaign.campaignId = :campaignId AND hc.student.studentId = :studentId")
    HealthCheck findByCampaignIdAndStudentId(Integer campaignId, Integer studentId);

    // Đoạn code này dùng JPQL nhá macbook trả ra kết quả dựa theo campaign ID
    @Query("SELECT hc FROM HealthCheck hc WHERE hc.campaign.campaignId = :campaignId AND hc.parentConfirmation = true AND hc.campaign.status = 'APPROVED'")
    List<HealthCheck> findByCampaignId(Integer campaignId);

    // Lấy hết các HealthCheck của một học sinh theo studentId
    @Query("SELECT hc FROM HealthCheck hc WHERE hc.student.studentId = :studentId AND hc.campaign.status = 'APPROVED'")
    List<HealthCheck> findByStudentId(Integer studentId);

    @Query("SELECT hc FROM HealthCheck hc WHERE :startDate <= hc.date AND hc.date <= :endDate OR hc.consultationAppointment = :consultationAppointment")
    List<HealthCheck> findResultWithDate(LocalDate startDate, LocalDate endDate,boolean consultationAppointment);

    @Query("SELECT v FROM HealthCheck v WHERE v.campaign IN :campaigns")
    List<HealthCheck> findByCampaign(List<HealthCheckCampaign> campaigns);

    // findByStudentIn
    @Query("SELECT hc FROM HealthCheck hc WHERE hc.student IN :students AND hc.campaign.status = 'APPROVED'")
    List<HealthCheck> findByStudentIn(List<Student> students);
}

