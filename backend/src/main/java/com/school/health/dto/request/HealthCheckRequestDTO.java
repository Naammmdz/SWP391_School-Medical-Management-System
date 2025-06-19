package com.school.health.dto.request;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HealthCheckRequestDTO {
    @NotNull(message = "Ngày khám không được để trống")
    private LocalDate date;
    @Positive(message = "Chiều cao phải lớn hơn 0")
    private double height;
    @Positive(message = "Cân nặng phải lớn hơn 0")
    private double weight;
    //
    @NotBlank(message = "Không được để trống")
    private String eyesightLeft;
    @NotBlank(message = "Không được để trống")
    private String eyesightRight;
    @NotBlank(message = "Không được để trống")
    private String bloodPressure;
    @NotBlank(message = "Không được để trống")
    private String hearingLeft;
    @NotBlank(message = "Không được để trống")
    private String hearingRight;
    @NotBlank(message = "Không được để trống")
    private String temperature;
    @NotBlank(message = "Không được để trống")
    private boolean consultationAppointment;
    //
    private String notes;
    private boolean parentConfirmation;
    @Positive(message = "ID học sinh không hợp lệ")
    private int studentId;
    @Positive(message = "ID chiến dịch không hợp lệ")
    private int campaignId;
}
