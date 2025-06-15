package com.school.health.dto.request;

import java.time.LocalDate;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VaccinationRequestDTO {
    private LocalDate date;
    private String notes;
    private boolean parentConfirmation;
    @NotBlank(message = "Kết quả không được để trống")
    private String result;
    @NotBlank(message = "Tên vắc xin không được để trống")
    private String vaccineName;
    @Positive(message = "ID học sinh phải là số dương")
    private int studentId;
    @Positive(message = "ID chiến dịch phải là số dương")
    private int campaignId;
}
