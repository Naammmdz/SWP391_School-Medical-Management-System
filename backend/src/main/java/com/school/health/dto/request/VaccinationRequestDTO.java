package com.school.health.dto.request;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VaccinationRequestDTO {
    @NotBlank(message = "không được để trống")
    private LocalDate date;
    @NotBlank(message = "không được để trống")
    private Integer doseNumber;
    @NotBlank(message = "không được để trống")
    private String adverseReaction;
    @NotBlank(message = "không được để trống")
    private boolean isPreviousDose;
    private String notes;
    @NotBlank(message = "không được để trống")
    private boolean parentConfirmation;
    @NotBlank(message = "Kết quả không được để trống")
    private String result;
    @NotBlank(message = "Tên vắc xin không được để trống")
    private String vaccineName;
    @Positive(message = "ID học sinh phải là số dương")
    @NotBlank(message = "không được để trống")
    private int studentId;
    @Positive(message = "ID chiến dịch phải là số dương")
    @NotBlank(message = "không được để trống")
    private int campaignId;
}
