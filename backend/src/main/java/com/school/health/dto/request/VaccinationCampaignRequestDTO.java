package com.school.health.dto.request;

import com.school.health.enums.Status;
import com.school.health.validate.MinDaysAhead;
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
    @NotBlank(message = "không được để trống")
    private String targetGroup;
    @NotBlank(message = "không được để trống")
    private String type;
    @NotBlank(message = "không được để trống")
    private String address; // địa điểm tổ chức khám
    @NotBlank(message = "không được để trống")
    private String organizer; // người thực hiện chiến dịch
    private String description;
    @NotNull(message = "Ngày tiêm chủng không được để trống")
    @Future(message = "Ngày tiêm chủng phải là ngày trong tương lai")
    @MinDaysAhead(days = 20)
    private LocalDate scheduledDate;
    @Enumerated(EnumType.STRING)
    @NotNull(message = "Trạng thái không được để trống")
    private Status status;
}
