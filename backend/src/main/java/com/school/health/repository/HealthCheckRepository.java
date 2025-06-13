package com.school.health.repository;

import com.school.health.entity.HealthCheck;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HealthCheckRepository extends JpaRepository<HealthCheck, Integer> {

}

