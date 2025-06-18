package com.school.health.service.impl;

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
            helper.setFrom(emailFrom, "Phòng CTSV FPT University");
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
    // Viết comment giải thích toàn bộ code sendMail này đi
    /**
     * Gửi email với các thông tin đã cho.
     *
     * @param toWho   Địa chỉ email người nhận, có thể là nhiều địa chỉ cách nhau bằng dấu phẩy.
     * @param subject Tiêu đề của email.
     * @param body    Nội dung của email, có thể chứa HTML.
     * @param files   Mảng các tệp đính kèm (có thể null).
     * @return Trả về "sent" nếu gửi thành công, "failed" nếu có lỗi xảy ra.
     */
    // Giải thích toàn bộ code ở trên mỗi dòng là gì có tác dụng gì
    // Phương thức này sử dụng JavaMailSender để tạo và gửi email.
    // Đầu tiên, nó tạo một đối tượng MimeMessage để đại diện cho email.
    // Sau đó, nó sử dụng MimeMessageHelper để thiết lập các thuộc tính của email như người gửi, người nhận, tiêu đề và nội dung.
    // Nếu có tệp đính kèm, nó sẽ thêm chúng vào email.
    // Cuối cùng, nó gửi email thông qua mailSender và ghi log thông tin gửi thành công hoặc lỗi nếu có.
    // Nếu gửi thành công, nó trả về "sent", nếu có lỗi xảy ra, nó ghi log lỗi và trả về "failed".
    // Phương thức này có thể được sử dụng để gửi thông báo, thông tin hoặc tài liệu đến người dùng hoặc nhân viên trong trường học.
    // Nó hỗ trợ gửi email đến nhiều người nhận và có thể đính kèm tệp nếu cần.



}
