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

    @Query ("Select n from Notification n where n.id = :id")
    Notification getNotificationById(@Param("id") int id);

// khi ma ghi dung theo thu tu va noi dung
    @Query ("Select n from Notification n where n.isRead = false and n.toUserId.userId = :userID")
    List<Notification> getNotificationsUnread(@Param("userID") int id);

}
