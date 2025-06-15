package com.school.health.dto.request;

import com.school.health.enums.Status;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VaccinationCampaignRequestDTO {
    @NotBlank(message = "Tên chiến dịch không được để trống")
    private String campaignName;
    private String description;
    @NotNull(message = "Ngày tiêm chủng không được để trống")
    @Future(message = "Ngày tiêm chủng phải là ngày trong tương lai")
    private LocalDate scheduledDate;
    @Enumerated(EnumType.STRING)
    @NotNull(message = "Trạng thái không được để trống")
    private Status status;
}
