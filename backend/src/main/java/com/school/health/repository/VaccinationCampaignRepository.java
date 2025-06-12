package com.school.health.repository;

import com.school.health.entity.Student;
import com.school.health.entity.VaccinationCampaign;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VaccinationCampaignRepository extends JpaRepository<VaccinationCampaign, Integer> {
    @Query("SELECT s.student FROM Vaccination s WHERE s.campaign.campaignId = :campaignId AND s.parentConfirmation = true")
    List<Student> getStudentWithParentConfirmation(Integer campaignId);
}
