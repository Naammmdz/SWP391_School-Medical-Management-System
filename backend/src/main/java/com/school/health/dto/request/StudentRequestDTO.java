package com.school.health.dto.request;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.*;
import lombok.*;

@Data
public class StudentRequestDTO {

    @NotBlank(message = "Họ và tên không được để trống")
    private String fullName;
    @NotNull(message = "Năm sinh không được để trống")
    @Past(message = "Năm sinh phải là ngày trong quá khứ")
    private LocalDate yob;
    @Pattern(regexp = "^(Nam|Nữ)$", message = "Giới tính chỉ có thể là Nam hoặc Nữ")
    private String gender;
    @NotBlank(message = "Lớp không được để trống")
    private String className;
    @NotNull(message = "ID phụ huynh không được để trống")
    @Positive(message = "ID phụ huynh phải là số dương")
    private Integer parentId;

}
