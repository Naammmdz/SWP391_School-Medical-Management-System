package com.school.health.repository;


import com.school.health.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentRepository extends JpaRepository<Student, Integer> {

    // Tìm học sinh theo parent ID
    List<Student> findByParentUserId(Integer parentUserId);

    // Tìm học sinh theo parent ID và trạng thái hoạt động
    List<Student> findByParentUserIdAndIsActive(Integer parentUserId, boolean isActive);


    // Tìm học sinh theo lớp
    List<Student> findByClassName(String className);

    // Tìm học sinh theo khối
    @Query("SELECT s FROM Student s WHERE s.className LIKE CONCAT('%', :gradeNumber, '%')")
    List<Student> findByGrade(@Param("gradeNumber") String gradeNumber);



    // Tìm học sinh theo tên (không phân biệt hoa thường)
    List<Student> findByFullNameContainingIgnoreCase(String fullName);

    // Custom query để tìm học sinh chưa có hồ sơ sức khỏe
    @Query("SELECT s FROM Student s WHERE s.healthProfile IS NULL")
    List<Student> findStudentsWithoutHealthProfile();

    // Tìm học sinh theo parent ID và có hồ sơ sức khỏe
    @Query("SELECT s FROM Student s WHERE s.parent.userId = :parentId AND s.healthProfile IS NOT NULL")
    List<Student> findStudentsWithHealthProfileByParentId(@Param("parentId") Integer parentId);

    // findByParentId
    @Query("SELECT s FROM Student s WHERE s.parent.userId = :parentId")
    List<Student> findByParentId(Integer parentId);
}