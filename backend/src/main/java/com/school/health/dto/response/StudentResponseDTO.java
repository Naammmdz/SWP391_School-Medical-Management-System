package com.school.health.dto.response;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class StudentResponseDTO {
    private Integer studentId;
    private String fullName;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dob;
    private String gender;
    private String className;
    private boolean isActive;
    private Integer parentId;
    private String phone;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;
}