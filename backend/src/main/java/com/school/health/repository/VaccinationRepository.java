package com.school.health.repository;

import com.school.health.entity.Student;
import com.school.health.entity.Vaccination;
import com.school.health.entity.VaccinationCampaign;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;


@Repository
public interface VaccinationRepository extends JpaRepository<Vaccination, Integer>, JpaSpecificationExecutor<Vaccination> {

    @Query("SELECT v FROM Vaccination v WHERE v.student.studentId = :studentId AND v.campaign.campaignId = :campaignId")
    Vaccination existStudent(Integer studentId, Integer campaignId);

    @Query("SELECT COUNT(s) > 0 FROM Student s WHERE s.studentId = :studentId AND s.parent.userId = :parentId")
    boolean existsByStudentStudentIdAndStudentParentUserId(Integer studentId, Integer parentId);

    @Query("SELECT v FROM Vaccination v WHERE v.campaign.campaignId = :campaignId")
    List<Vaccination> findByCampaignId(Integer campaignId);

    @Query("SELECT v FROM Vaccination v WHERE v.student.studentId = :studentId")
    List<Vaccination> findByStudentId(Integer studentId);

    @Query("SELECT hc FROM Vaccination hc WHERE :startDate <= hc.date AND hc.date <= :endDate")
    List<Vaccination> findResultWithDate(LocalDate startDate, LocalDate endDate);

    @Query("SELECT v FROM Vaccination v WHERE v.campaign IN :campaigns")
    List<Vaccination> findByCampaign(List<VaccinationCampaign> campaigns);

    //findByStudentIn
    @Query("SELECT v FROM Vaccination v WHERE v.student IN :students")
    List<Vaccination> findByStudentIn(List<Student> students);
}
