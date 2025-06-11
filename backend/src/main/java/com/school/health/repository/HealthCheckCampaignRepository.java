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
   List<Student> findStudentWithParentConfirmationInCampaign(Integer campaignId);


}
