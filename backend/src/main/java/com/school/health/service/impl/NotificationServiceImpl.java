package com.school.health.service.impl;

import com.school.health.dto.response.NotificationResponseDTO;
import com.school.health.entity.Notification;
import com.school.health.repository.NotificationRepository;
import com.school.health.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service

public class NotificationServiceImpl implements NotificationService {
    @Autowired
    NotificationRepository notificationRepository;
    @Override
    public void createNotification(int toUserId, String title, String message, String type, Long relatedItemId) {

    }

    @Override
    public List<NotificationResponseDTO> getByUserId(int userId) {
        List<Notification> notificationList = notificationRepository.getNotificationsById(userId);
        return  notificationList.stream().map(this::mapToNotificationResponseDto)
                .collect(Collectors.toList());


    }

    @Override
    public void markRead(Long notificationId, Long userId) {

    }

    @Override
    public void markAllRead(Long userId) {

    }

    @Override
    public long countUnread(Long userId) {
        return 0;
    }

    @Override
    public NotificationResponseDTO mapToNotificationResponseDto(Notification notification) {
        NotificationResponseDTO notificationResponseDTO = new NotificationResponseDTO();
        notificationResponseDTO.setId(notification.getId());
        notificationResponseDTO.setUserId(notificationResponseDTO.getUserId());
        notificationResponseDTO.setTitle(notification.getTitle());
        notificationResponseDTO.setMessage(notification.getMessage());
        notificationResponseDTO.setIsRead(notification.isRead());
        notificationResponseDTO.setCreatedAt(notification.getCreatedAt());
        return notificationResponseDTO;
    }
}
