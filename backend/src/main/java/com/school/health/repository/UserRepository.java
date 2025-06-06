package com.school.health.repository;

import com.school.health.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    // Tìm user bằng email
    @Query("SELECT u FROM User u WHERE u.email = :email")
    Optional<User> findByEmail(String email);
    // chỗ này có cần khai báo query không hay có sẵn trong JPA rồi
    // Nếu cần thì có thể dùng @Query để viết query tùy chỉnh
    // Ví dụ: @Query("SELECT u FROM User u WHERE u.email = ?1")
    // Tìm user bằng email

    // Tìm user bằng số điện thoại
    Optional<User> findByPhone(String phone);

    Optional<User> findByUserId(Integer userId);

    boolean existsByEmail(String email);

    boolean existsByPhone(String phone);
}
