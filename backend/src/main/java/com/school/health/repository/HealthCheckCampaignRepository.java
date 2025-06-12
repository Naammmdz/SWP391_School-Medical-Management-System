package com.school.health.repository;

import com.school.health.entity.HealthCheck;
import com.school.health.entity.HealthCheckCampaign;
import com.school.health.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HealthCheckCampaignRepository extends JpaRepository<HealthCheckCampaign, Integer> {
    // Lấy tất cả các chiến dịch sức khỏe
    @Query("Select hc.student FROM HealthCheck hc WHERE hc.campaign.campaignId = :campaignId AND hc.parentConfirmation = true")
   List<Student> findStudentWithParentConfirmationInCampaign(Integer campaignId);


}
