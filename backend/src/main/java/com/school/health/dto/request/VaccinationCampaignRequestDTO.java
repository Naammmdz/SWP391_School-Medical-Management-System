package com.school.health.dto.request;

import com.school.health.enums.Status;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VaccinationCampaignRequestDTO {
    @NotBlank(message = "Tên chiến dịch không được để trống")
    private String campaignName;

    @NotBlank(message = "Nhóm đối tượng không được để trống")
    private String targetGroup;

    @NotBlank(message = "Loại tiêm chủng không được để trống")
    private String type;

    @NotBlank(message = "Địa điểm không được để trống")
    private String address;

    @NotBlank(message = "Người tổ chức không được để trống")
    private String organizer;

    private String description; // Optional

    @NotNull(message = "Ngày tiêm chủng không được để trống")
    @Future(message = "Ngày tiêm chủng phải là ngày trong tương lai")
    private LocalDate scheduledDate;

    @NotNull(message = "Trạng thái không được để trống")
    private Status status;
}
