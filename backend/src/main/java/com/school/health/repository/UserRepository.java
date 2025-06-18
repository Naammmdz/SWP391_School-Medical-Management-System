package com.school.health.repository;

import com.school.health.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer>, JpaSpecificationExecutor<User> {

    // Tìm user bằng email
    Optional<User> findByEmail(String email);

    // Tìm user bằng số điện thoại
    Optional<User> findByPhone(String phone);

    Optional<User> findByUserId(Integer userId);

    boolean existsByEmail(String email);

    boolean existsByPhone(String phone);

    //tìm người dùng có vai trò là Admin hoac Nurse
    @Query("select u from User u where u.role='ADMIN' or u.role='NURSE'")
    List<User> findAllAdminAndNurse ();

    // tìm người dùng có vai trò là Nurse
    @Query("select u from User u where u.role='NURSE'")
    List<User> findAllNurse ();
}
