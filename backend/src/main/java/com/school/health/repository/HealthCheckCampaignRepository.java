package com.school.health.repository;

import com.school.health.entity.HealthCheckCampaign;
import com.school.health.entity.Student;
import com.school.health.enums.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HealthCheckCampaignRepository extends JpaRepository<HealthCheckCampaign, Integer> {
    // Lấy tất cả các chiến dịch sức khỏe
    @Query("Select hc.student FROM HealthCheck hc WHERE hc.campaign.campaignId = :campaignId AND hc.parentConfirmation = true")
    List<Student> findStudentWithParentConfirmationInCampaign(Integer campaignId);

    @Query("SELECT h FROM HealthCheckCampaign h WHERE h.status = :status")
    List<HealthCheckCampaign> findByStatus(Status status);

    // Trả ra danh sách các chiến dịch sức khỏe của học sinh theo studentId với JPQL
    @Query("SELECT h FROM HealthCheckCampaign h JOIN HealthCheck hc ON h.campaignId = hc.campaign.campaignId WHERE hc.student.studentId = :studentId ")
    List<HealthCheckCampaign> findCampaignsByStudentId(Integer studentId);

    @Query("SELECT h FROM HealthCheckCampaign h JOIN HealthCheck hc ON h.campaignId = hc.campaign.campaignId WHERE hc.student.studentId = :studentId AND hc.parentConfirmation = :parentConfirmation")
    List<HealthCheckCampaign> findCampaignsByStudentIdAndParentConfirmation(Integer studentId, boolean parentConfirmation);

}
