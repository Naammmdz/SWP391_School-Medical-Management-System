package com.school.health.service;

import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@Service
@RequiredArgsConstructor
public class MailService {

    private final JavaMailSender mailSender;
    @Value("${spring.mail.from}")
    private String emailFrom;

    public String sendEmail(String toWho, String subject, String body, MultipartFile[] files) {
        try {
            log.info("Sending email to: {}...", toWho);
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(emailFrom, "Huy from FPT");

            if(toWho.contains(",")) {
                helper.setTo(InternetAddress.parse(toWho));
            } else {
                helper.setTo(toWho);
            }

            if(files != null) {
                for (MultipartFile file : files) {
                    helper.addAttachment(file.getOriginalFilename(), file);
                }
            }
            helper.setSubject(subject);
            helper.setText(body, true);
            mailSender.send(message);
            log.info("Email sent to: {}", toWho);
            return "sent";
        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", toWho, e.getMessage(), e);
            return "failed";
        }
    }
//    public String sendEmail(String toWho, String subject, String content, MultipartFile[] files) {
//        log.info("Sending email to: ...");
//        MimeMessage message = mailSender.createMimeMessage();
//        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
//        helper.setFrom(emailFrom);  // TO DO gan ten
//        if(toWho.contains(",")) {
//            helper.setTo(InternetAddress.parse(toWho));
//        } else {
//            helper.setTo(toWho); // TO DO gan ten
//        }
//        if(files != null) {
//            for ( MultipartFile file : files ) {
//                helper.addAttachment(file.getOriginalFilename(), file);
//            }
//        }
//        helper.setSubject(subject);
//        helper.setText(content, true); // true for HTML content
//        mailSender.send(message);
//        log.info("Email sent to: {}", toWho);
//        return "sent";
//
//
//    }

}
