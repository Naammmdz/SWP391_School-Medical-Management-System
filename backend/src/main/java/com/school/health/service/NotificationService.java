package com.school.health.service;


import com.school.health.dto.response.NotificationResponseDTO;
import com.school.health.entity.Notification;

import java.util.List;

public interface NotificationService {
        void createNotification(int toUserId, String title, String message, String type, Long relatedItemId);
        List<NotificationResponseDTO> getByUserId(int userId);
        void markRead(Long notificationId, Long userId);
        void markAllRead(Long userId);
        long countUnread(Long userId);
        public NotificationResponseDTO mapToNotificationResponseDto (Notification notification);
    }

