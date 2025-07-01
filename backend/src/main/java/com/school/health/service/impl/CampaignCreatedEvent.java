package com.school.health.service.impl;

import com.school.health.entity.HealthCheckCampaign;

public class CampaignCreatedEvent {
    private final HealthCheckCampaign campaign;

    public CampaignCreatedEvent(HealthCheckCampaign campaign) {
        this.campaign = campaign;
    }

    public HealthCheckCampaign getCampaign() {
        return campaign;
    }
}
