package com.school.health.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class UpdateHealthProfileDTO {

    @Size(max = 255, message = "Thông tin dị ứng không được vượt quá 255 ký tự")
    private String allergies;

    @Size(max = 255, message = "Thông tin bệnh mãn tính không được vượt quá 255 ký tự")
    private String chronicDiseases;

    @Size(max = 255, message = "Tiền sử điều trị không được vượt quá 255 ký tự")
    @NotBlank(message = "Tiền sử điều trị không được để trống")
    private String treatmentHistory;

    @Size(max = 50, message = "Thông tin thị lực không được vượt quá 50 ký tự")
    @NotBlank(message = "không được để trống")
    private String eyesight;

    @Size(max = 50, message = "Thông tin thính lực không được vượt quá 50 ký tự")
    @NotBlank(message = "không được để trống")
    private String hearing;

    @Pattern(regexp = "^(A|B|AB|O)[+-]?$", message = "Nhóm máu không hợp lệ (A, B, AB, O với + hoặc -)")
    @NotBlank(message = "không được để trống")
    private String bloodType;

    @DecimalMin(value = "0.1", message = "Cân nặng phải lớn hơn 0.1 kg")
    @DecimalMax(value = "999.99", message = "Cân nặng không được vượt quá 999.99 kg")
    @NotBlank(message = "không được để trống")
    private BigDecimal weight;

    @DecimalMin(value = "0.1", message = "Chiều cao phải lớn hơn 0.1 cm")
    @DecimalMax(value = "999.99", message = "Chiều cao không được vượt quá 999.99 cm")
    @NotBlank(message = "không được để trống")
    private BigDecimal height;

    @Size(max = 255, message = "Ghi chú không được vượt quá 255 ký tự")
    private String notes;
}