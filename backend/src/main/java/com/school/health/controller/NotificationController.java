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
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
@Validated
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationServiceImpl notificationService;
    //Lấy hết thông báo của người dùng hiện tại
    @GetMapping("/me")
    public ResponseEntity<List<NotificationResponseDTO>> getAllNotifications(Authentication authentication) {
        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();
        Integer userId = userPrincipal.getId();
       List<NotificationResponseDTO> list = notificationService.getAllNoti(userId);
        return ResponseEntity.ok(list);
    }
    //Lấy hết thông báo chưa đọc
    @GetMapping("/me-unread")
    public ResponseEntity<List<NotificationResponseDTO>> getAllNotificationsUnRead(Authentication authentication) {
        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();
        Integer userId = userPrincipal.getId();
        List<NotificationResponseDTO> list = notificationService.getAllNotiUnread(userId);
        return ResponseEntity.ok(list);
    }
    //Đánh dấu đã đọc thông báo có notificationId
    @PostMapping ("/{notificationId}/read")
    public ResponseEntity<NotificationResponseDTO> readNotification(@PathVariable Integer notificationId, Authentication authentication) {

        return ResponseEntity.ok(notificationService.markRead(notificationId));
    }
    //Đánh dấu đã đọc hết tất cả thông báo
    @PostMapping ("/mark-all-read")
    public ResponseEntity<List<NotificationResponseDTO>> markAllReadNotifications(Authentication authentication) {
        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();
        Integer userId = userPrincipal.getId();
        return ResponseEntity.ok(notificationService.markAllRead(userId));
    }
    //Đếm số lượng có bao nhiêu thông báo chưa đọc
    @GetMapping ("/unread-count")
    public ResponseEntity<Integer> getUnreadNotifications(Authentication authentication) {
        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();
        Integer userId = userPrincipal.getId();
        return ResponseEntity.ok(notificationService.countUnread(userId));
    }
    //Tạo thông báo gửi đến người dùng có ID là UserID
    @PostMapping ("/create/{userId}")
    @PreAuthorize("hasRole('NURSE') or hasRole('ADMIN')")
    public ResponseEntity<NotificationResponseDTO> createNotification(@PathVariable Integer userId, @RequestBody NotificationRequestDTO notificationRequestDTO) {
//        Notification notification = new Notification();

        return ResponseEntity.ok(notificationService.createNotification(userId,notificationRequestDTO.getTitle(),notificationRequestDTO.getMessage()));

    }
}

