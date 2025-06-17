package com.school.health.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class HealthDashboardResponse {
    private Long pendingApproval;
    private Long todayMedicineLogs;
    private Long activeSubmissions;
    private Long expiringSubmissions;
}
