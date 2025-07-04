package com.school.health.event.noti;

import com.school.health.entity.HealthCheckCampaign;

public class HealthCheckCampaignCreatedEvent{

        private final HealthCheckCampaign campaign;

        public HealthCheckCampaignCreatedEvent(HealthCheckCampaign campaign) {
            this.campaign = campaign;
        }

        public HealthCheckCampaign getCampaign() {
            return campaign;
        }

}
