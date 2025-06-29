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
    // thêm field đối tượng áp dụng nữa ví dụ : lớp 3A 3B 3C hay theo khối ...
    @NotBlank(message = "Phải nhập nhóm đối tượng")
    private String targetGroup;
    @NotBlank(message = "Phải nhập loại khám sức khỏe")
    private String type;
    @NotBlank(message = "Phải nhập địa điểm tổ chức")
    private String address; // địa điểm tổ chức khám
    @NotBlank(message = "Phải nhập nhóm thực hiện")
    private String organizer; // người thực hiện chiến dịch
    private String description;
    @NotNull(message = "Ngày khám không được để trống")
    @Future(message = "Ngày khám phải là ngày trong tương lai")
    private LocalDate scheduledDate;
    @Enumerated(EnumType.STRING)
    @Column(name = "Status")
    @NotNull(message = "Trạng thái không được để trống")
    private Status status;
}
