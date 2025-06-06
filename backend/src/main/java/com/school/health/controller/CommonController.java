package com.school.health.controller;

import com.school.health.service.MailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/common")
@Slf4j
@RequiredArgsConstructor
public class CommonController {

    private final MailService mailService;
    @PostMapping("/send-email")
    public ResponseEntity<?> sendEmail(@RequestParam String toWho,
                                       @RequestParam String subject,
                                       @RequestParam String body,
                                       @RequestParam(required = false) MultipartFile[] files)  {
        try {
            return ResponseEntity.ok(mailService.sendEmail(toWho, subject, body, files));
        } catch (Exception e) {
            log.error("Sending email failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Sending email failed: " + e.getMessage());
        }
    }
}
