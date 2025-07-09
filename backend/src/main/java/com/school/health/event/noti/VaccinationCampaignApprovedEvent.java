package com.school.health.event.noti;

import com.school.health.entity.VaccinationCampaign;

public class VaccinationCampaignApprovedEvent {
    private final VaccinationCampaign campaign;

    public VaccinationCampaignApprovedEvent(VaccinationCampaign campaign) {
        this.campaign = campaign;
    }

    public VaccinationCampaign getCampaign() {
        return campaign;
    }
}
