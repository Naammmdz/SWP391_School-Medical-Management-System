package com.school.health.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class MedicineSubmissionResponse {
    private Integer id;
    private Integer studentId;
    private String studentName;
    private Integer parentId;
    private String parentName;
    private String instruction;
    private Integer duration;
    private LocalDate startDate;
    private LocalDate endDate;
    private String notes;
    private String submissionStatus;
    private Integer approvedBy;
    private String approvedByName;
    private LocalDate approvedAt;
//    private List<MedicineDetailResponse> medicineDetails;
    private String imageData;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private List<MedicineLogResponse> medicineLogs;
}
