package com.school.health.dto.request;

import com.school.health.enums.Status;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HealthCampaignRequestDTO {
    @NotBlank(message = "Tên chiến dịch không được để trống")
    private String campaignName;
    private String description;
    @NotNull(message = "Ngày khám không được để trống")
    @Future(message = "Ngày khám phải là ngày trong tương lai")
    private LocalDate scheduledDate;
    @Enumerated(EnumType.STRING)
    @Column(name = "Status")
    @NotNull(message = "Trạng thái không được để trống")
    private Status status;
}
