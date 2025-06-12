package com.school.health.repository;

import com.school.health.entity.MedicineSubmission;
import com.school.health.enums.MedicineSubmissionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MedicineSubmissionRepository extends JpaRepository<MedicineSubmission, Integer> {
    List<MedicineSubmission> findByParent_UserId(Integer parentId);
    List<MedicineSubmission> findByParent_UserIdAndStudent_StudentIdAndSubmissionStatus(Integer parentId, Integer studentId, MedicineSubmissionStatus status);
    List<MedicineSubmission> findByParent_UserIdAndStudent_StudentId(Integer parentId, Integer studentId);
    List<MedicineSubmission> findByParent_UserIdAndSubmissionStatus(Integer parentId, MedicineSubmissionStatus status);
    List<MedicineSubmission> findByStudent_StudentIdAndSubmissionStatus(Integer studentId, MedicineSubmissionStatus status);
    long countByStudent_StudentIdAndSubmissionStatus(Integer studentId, MedicineSubmissionStatus status);
    List<MedicineSubmission> findByStudent_StudentId(Integer studentId);


    List<MedicineSubmission> findBySubmissionStatus(MedicineSubmissionStatus status);

    @Query("SELECT m FROM MedicineSubmission m ORDER BY m.submissionDate DESC")
    List<MedicineSubmission> findAllOrderBySubmissionDateDesc();

    @Query("SELECT m FROM MedicineSubmission m ORDER BY m.submissionStatus ASC, m.startDate DESC")
    List<MedicineSubmission> findAllOrderByStatusAndDate();

    @Query("SELECT m FROM MedicineSubmission m WHERE m.submissionStatus = :status ORDER BY m.startDate DESC")
    List<MedicineSubmission> findByStatusOrderByDate(@Param("status") MedicineSubmissionStatus status);

    // Đếm số đơn theo trạng thái
    long countBySubmissionStatus(MedicineSubmissionStatus status);

    // Đếm số đơn thuốc được cấp phát trong ngày
    @Query("SELECT COUNT(m) FROM MedicineSubmission m WHERE m.startDate <= :date AND m.endDate >= :date AND m.submissionStatus = 'APPROVED'")
    long countByGivenAt(@Param("date") LocalDate date);

    // Đếm số đơn thuốc đang còn hiệu lực (đang dùng)
    @Query("SELECT COUNT(m) FROM MedicineSubmission m WHERE m.startDate <= :date AND m.endDate >= :date AND m.submissionStatus = 'APPROVED'")
    long countActiveSubmissions(@Param("date") LocalDate date);

    // Đếm số đơn thuốc sắp hết hạn (trong 3 ngày tới)
    @Query("SELECT COUNT(m) FROM MedicineSubmission m WHERE m.endDate <= :date AND m.submissionStatus = 'APPROVED'")
    long countExpiringSubmissions(@Param("date") LocalDate date);

    long countBySubmissionDate(LocalDate submissionDate);
}
