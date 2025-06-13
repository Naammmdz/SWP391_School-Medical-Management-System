package com.school.health.service;


import com.school.health.dto.request.NotificationRequestDTO;
import com.school.health.dto.response.NotificationResponseDTO;
import com.school.health.entity.Notification;

import java.util.List;

public interface NotificationService {
        NotificationResponseDTO createNotification(int toUserId, String title, String message);
        List<NotificationResponseDTO> getByUserId(int userId);
        NotificationResponseDTO markRead(int notificationId);
        List<NotificationResponseDTO> markAllRead(int userId);
        int countUnread(int userId);
        public NotificationResponseDTO mapToNotificationResponseDto (Notification notification);
    }

