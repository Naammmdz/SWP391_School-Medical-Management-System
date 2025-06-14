package com.school.health.dto.response;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class StudentResponseDTO {
    private Integer studentId;
    private String fullName;
    private LocalDate dob;
    private String gender;
    private String className;
    private Integer parentId;
    private LocalDateTime createdAt;
    private boolean hasHealthProfile;
}