package com.school.health.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StudentSummaryResponse {
    private Integer studentId;
    private String fullName;
    private String className;
    private Long pendingSubmissions;   // Số đơn đang chờ
    private Long approvedSubmissions;
}
