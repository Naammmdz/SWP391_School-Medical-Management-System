package com.school.health.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.school.health.enums.MedicalEventStatus;
import com.school.health.enums.SeverityLevel;
import jakarta.validation.constraints.PastOrPresent;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
public class MedicalEventsRequestDTO {
    private String title;                     // Tiêu đề sự cố
    private List<Integer> stuId = new ArrayList<>();                        // ID học sinh
    private String eventType;
    // Loại sự cố
//    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS")
    @PastOrPresent(message = "Thời gian xảy ra phải là quá khứ hoặc hiện tại!!")
    private LocalDateTime eventDate;          // Thời điểm xảy ra
    private String location;                  // Địa điểm xảy ra
    private String description;               // Mô tả chi tiết
    private List<InventoryUsedInMedicalEventRequestDTO> relatedItemUsed = new ArrayList<>();// Thuốc đã dùng (nếu có)
    private String notes;                     // Ghi chú thêm
    private String handlingMeasures;          // Biện pháp xử lý
    private SeverityLevel severityLevel;      // Mức độ nghiêm trọng (Enum)
    private MedicalEventStatus status;        // Trạng thái xử lý (Enum)

}
