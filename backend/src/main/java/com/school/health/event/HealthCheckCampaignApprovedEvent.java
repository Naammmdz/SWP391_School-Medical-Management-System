package com.school.health.event;

import com.school.health.entity.HealthCheckCampaign;

public class HealthCheckCampaignApprovedEvent {
    private final HealthCheckCampaign campaign;

    public HealthCheckCampaignApprovedEvent(HealthCheckCampaign campaign) {
        this.campaign = campaign;
    }

    public HealthCheckCampaign getCampaign() {
        return campaign;
    }

}
