package com.school.health.dto.response;

import lombok.Data;

@Data
public class AdminDashboardResponse {
    private long totalSubmissions;
    private long pendingSubmissions;
    private long approvedSubmissions;
    private long rejectedSubmissions;
    private long todaySubmissions;
}
