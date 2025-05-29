package com.school.health.repository;

import com.school.health.entity.Students;
import com.school.health.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StudentRepository extends JpaRepository<Students, Long> {
    // Define any additional query methods if needed
    List<Students> findAllByParent(Users parent);

}
