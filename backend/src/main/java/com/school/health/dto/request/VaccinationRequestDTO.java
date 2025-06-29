package com.school.health.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VaccinationRequestDTO {
    private LocalDate date;
    private Integer doseNumber;
    @NotBlank(message = "không được để trống")
    private String adverseReaction;
    private boolean isPreviousDose;
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
