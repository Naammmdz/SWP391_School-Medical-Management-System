package com.school.health.service.impl;

import com.school.health.dto.response.NotificationResponseDTO;
import com.school.health.entity.Notification;
import com.school.health.entity.User;
import com.school.health.repository.NotificationRepository;
import com.school.health.repository.UserRepository;
import com.school.health.service.NotificationService;
//import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service

public class NotificationServiceImpl implements NotificationService {
    @Autowired
    NotificationRepository notificationRepository;
    @Autowired
    UserRepository userRepository;

    @Override
    public NotificationResponseDTO createNotification(int toUserId, String title, String message) {

        User user = userRepository.findByUserId(toUserId).orElseThrow();
        Notification notification = new Notification();
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setToUserId(user);
        notificationRepository.save(notification);
        return mapToNotificationResponseDto(notification);

    }


    @Override
    public NotificationResponseDTO markRead(int notificationId) {
        Notification notification = notificationRepository.getNotificationById(notificationId);
        notification.setRead(true);
        notificationRepository.save(notification);
        return mapToNotificationResponseDto(notification);
    }

    @Override
    public List<NotificationResponseDTO>  markAllRead(int userId) {
        List<Notification> notificationList = notificationRepository.getNotificationsIsNotReaded(userId);
        notificationList.forEach(notification -> {notification.setRead(true);
            notificationRepository.save(notification);
        } );
        return notificationList.stream().map(notification -> mapToNotificationResponseDto(notification)).collect(Collectors.toList());


    }

    @Override
    public int countUnread(int userId) {
        List<Notification> notificationList = notificationRepository.getNotificationsIsNotReaded(userId);
        return notificationList.size();
    }

    @Override
    public List<NotificationResponseDTO> getAllNoti(int userId) {
        List<Notification> notificationList = notificationRepository.getNotificationsById(userId);
        return  notificationList.stream().map(this::mapToNotificationResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<NotificationResponseDTO> getAllNotiUnReaded(int userId) {
        List<Notification> notificationList = notificationRepository.getNotificationsIsNotReaded(userId);
        return  notificationList.stream().map(this::mapToNotificationResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public NotificationResponseDTO mapToNotificationResponseDto(Notification notification) {
        NotificationResponseDTO notificationResponseDTO = new NotificationResponseDTO();
        notificationResponseDTO.setId(notification.getId());
        notificationResponseDTO.setUserId(notification.getToUserId().getUserId());
        notificationResponseDTO.setTitle(notification.getTitle());
        notificationResponseDTO.setMessage(notification.getMessage());
        notificationResponseDTO.setIsRead(notification.isRead());
        notificationResponseDTO.setCreatedAt(notification.getCreatedAt());
        return notificationResponseDTO;
    }


}
