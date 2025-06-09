package com.school.health.repository;

import com.school.health.entity.HealthCheckCampaign;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HealthCheckCampaignRepository extends JpaRepository<HealthCheckCampaign, Integer> {

}
