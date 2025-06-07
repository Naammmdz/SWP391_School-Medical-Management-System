package com.school.health.dto.request;

import java.time.LocalDate;

import jakarta.validation.constraints.Pattern;
import lombok.*;

@Data
public class StudentRequestDTO {
    private String fullName;
    private LocalDate yob;
    @Pattern(regexp = "^(Nam|Nữ)$", message = "Giới tính chỉ có thể là Nam hoặc Nữ")
    private String gender;
    private String className;
    private Integer parentId;

}
