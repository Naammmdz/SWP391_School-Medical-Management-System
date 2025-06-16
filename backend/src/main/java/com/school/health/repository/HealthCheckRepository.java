package com.school.health.repository;

import com.school.health.entity.HealthCheck;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface HealthCheckRepository extends JpaRepository<HealthCheck, Integer> {
    @Query("SELECT hc FROM HealthCheck hc WHERE hc.campaign.campaignId = :campaignId AND hc.student.studentId = :studentId")
    HealthCheck findByCampaignIdAndStudentId(Integer campaignId, Integer studentId);
}

