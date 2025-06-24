package com.school.health.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.*;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;


@Data
public class MedicineSubmissionRequest {

    @NotNull
    private Integer studentId;

    @NotBlank(message = "Hướng dẫn sử dụng không được để trống")
    @Size(max = 1000, message = "Hướng dẫn không được quá 255 ký tự")
    private String instruction;

//    @Min(value = 1, message = "Thời gian dùng thuốc phải là số dương")
//    private Integer duration;

    @NotNull
    @FutureOrPresent(message = "Ngày bắt đầu phải là ngày hiện tại hoặc tương lai")
    private LocalDate startDate;

    @NotNull
    private LocalDate endDate;

    @Size(max = 500)
    private String notes;

//    @NotEmpty
//    private List<MedicineDetailRequest> medicineDetails;
}
