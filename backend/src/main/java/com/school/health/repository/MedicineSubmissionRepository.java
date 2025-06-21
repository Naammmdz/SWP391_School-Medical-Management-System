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
    // Tìm tất cả đơn thuốc của một phụ huynh
    List<MedicineSubmission> findByParent_UserId(Integer parentId);

    // Tìm đơn thuốc theo phụ huynh, học sinh và trạng thái
    List<MedicineSubmission> findByParent_UserIdAndStudent_StudentIdAndSubmissionStatus(Integer parentId, Integer studentId, MedicineSubmissionStatus status);

    // Tìm tất cả đơn thuốc theo phụ huynh và học sinh
    List<MedicineSubmission> findByParent_UserIdAndStudent_StudentId(Integer parentId, Integer studentId);

    // Tìm đơn thuốc theo phụ huynh và trạng thái
    List<MedicineSubmission> findByParent_UserIdAndSubmissionStatus(Integer parentId, MedicineSubmissionStatus status);

    // Tìm đơn thuốc theo học sinh và trạng thái
    List<MedicineSubmission> findByStudent_StudentIdAndSubmissionStatus(Integer studentId, MedicineSubmissionStatus status);

    // Đếm số đơn thuốc của học sinh theo trạng thái
    long countByStudent_StudentIdAndSubmissionStatus(Integer studentId, MedicineSubmissionStatus status);

    // Tìm tất cả đơn thuốc của một học sinh
    List<MedicineSubmission> findByStudent_StudentId(Integer studentId);

    // Tìm đơn thuốc theo trạng thái
    List<MedicineSubmission> findBySubmissionStatus(MedicineSubmissionStatus status);

    // Lấy tất cả đơn thuốc, sắp xếp theo ngày nộp đơn giảm dần
    @Query("SELECT m FROM MedicineSubmission m ORDER BY m.submissionDate DESC")
    List<MedicineSubmission> findAllOrderBySubmissionDateDesc();

    // Lấy tất cả đơn thuốc, sắp xếp theo độ ưu tiên trạng thái và ngày bắt đầu
    // Độ ưu tiên: PENDING > APPROVED > REJECTED
    @Query("SELECT m FROM MedicineSubmission m ORDER BY " +
            "CASE WHEN m.submissionStatus = 'PENDING' THEN 0 " +
            "WHEN m.submissionStatus = 'APPROVED' THEN 1 " +
            "ELSE 2 END, m.startDate DESC")
    List<MedicineSubmission> findAllOrderByStatusAndDate();

    // Tìm đơn thuốc theo trạng thái, sắp xếp theo ngày bắt đầu giảm dần
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

    // Đếm số đơn thuốc được nộp trong một ngày
    long countBySubmissionDate(LocalDate submissionDate);
}
