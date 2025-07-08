package com.school.health.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.school.health.entity.InventoryUsedLog;
import com.school.health.enums.MedicalEventStatus;
import com.school.health.enums.SeverityLevel;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
public class MedicalEventsResponseDTO {
    private int id;                            // ID sự kiện
    private List<Integer> stuId = new ArrayList<>();                     // ID học sinh
    private String title;                      // Tiêu đề sự cố
    private String eventType;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS")
    // Loại sự cố
    private LocalDateTime eventDate;           // Thời gian xảy ra
    private String location;                   // Địa điểm xảy ra
    private String description;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS")
    // Mô tả chi tiết
    private LocalDateTime createdAt;           // Thời gian ghi nhận
    private Integer createdBy;                 // ID người tạo
    private List<InventoryUsedLogDTO> relatedMedicinesUsed = new ArrayList<>();       // Thuốc đã dùng (nếu có)
    private String notes;                      // Ghi chú
    private String handlingMeasures;           // Phương án xử lý
    private SeverityLevel severityLevel;       // Mức độ nghiêm trọng
    private MedicalEventStatus status;    // Trạng thái xử lý
    public void addStuId(Integer id) {
        stuId.add(id);
    }
    public void removeStuId(Integer id) {
        stuId.remove(id);
    }




}
