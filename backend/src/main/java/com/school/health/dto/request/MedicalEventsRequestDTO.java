package com.school.health.dto.request;

import com.school.health.enums.MedicalEventStatus;
import com.school.health.enums.SeverityLevel;
import lombok.Data;

import java.time.LocalDateTime;
@Data
public class MedicalEventsRequestDTO {
    private String title;                     // Tiêu đề sự cố
    private int stuId;                        // ID học sinh
    private String eventType;                 // Loại sự cố
    private LocalDateTime eventDate;          // Thời điểm xảy ra
    private String location;                  // Địa điểm xảy ra
    private String description;               // Mô tả chi tiết
    private String relatedMedicinesUsed;      // Thuốc đã dùng (nếu có)
    private String notes;                     // Ghi chú thêm
    private String handlingMeasures;          // Biện pháp xử lý
    private SeverityLevel severityLevel;      // Mức độ nghiêm trọng (Enum)
    private MedicalEventStatus status;        // Trạng thái xử lý (Enum)

}
