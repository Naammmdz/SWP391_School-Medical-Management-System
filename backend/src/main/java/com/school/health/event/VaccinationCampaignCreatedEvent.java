package com.school.health.event;


import com.school.health.entity.VaccinationCampaign;

public class VaccinationCampaignCreatedEvent {

    private final VaccinationCampaign campaign;

    public VaccinationCampaignCreatedEvent(VaccinationCampaign campaign) {
        this.campaign = campaign;
    }

    public VaccinationCampaign getCampaign() {
        return campaign;
    }

}
