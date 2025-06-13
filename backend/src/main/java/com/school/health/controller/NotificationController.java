package com.school.health.controller;

import com.school.health.dto.request.NotificationRequestDTO;
import com.school.health.dto.response.NotificationResponseDTO;
import com.school.health.entity.Notification;
import com.school.health.security.services.UserDetailsImpl;
import com.school.health.service.NotificationService;
import com.school.health.service.impl.NotificationServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/user/notifications")
@CrossOrigin(origins = "*")
@Validated
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationServiceImpl notificationService;

    @GetMapping("/me")
    public ResponseEntity<List<NotificationResponseDTO>> getAllNotifications(Authentication authentication) {
        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();
        Integer userId = userPrincipal.getId();
       List<NotificationResponseDTO> list = notificationService.getByUserId(userId);

        return ResponseEntity.ok(list);
    }
    @PostMapping ("/api/notifications/{notificationId}/read")
    public ResponseEntity<NotificationResponseDTO> readNotification(@PathVariable Integer notificationId, Authentication authentication) {

        return ResponseEntity.ok(notificationService.markRead(notificationId));
    }
    @PostMapping ("/api/notifications/mark-all-read")
    public ResponseEntity<List<NotificationResponseDTO>> markAllReadNotifications(Authentication authentication) {
        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();
        Integer userId = userPrincipal.getId();
        return ResponseEntity.ok(notificationService.markAllRead(userId));
    }
    @GetMapping ("/api/notifications/unread-count")
    public ResponseEntity<Integer> getUnreadNotifications(Authentication authentication) {
        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();
        Integer userId = userPrincipal.getId();
        return ResponseEntity.ok(notificationService.countUnread(userId));
    }
}

