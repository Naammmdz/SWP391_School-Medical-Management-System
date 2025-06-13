package com.school.health.repository;

import com.school.health.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface NotificationRepository extends JpaRepository<Notification, Integer> {
    @Query ("Select n from Notification n where n.toUserId.userId = :userID")
    List<Notification> getNotificationsById(@Param("userID") int id);
}
