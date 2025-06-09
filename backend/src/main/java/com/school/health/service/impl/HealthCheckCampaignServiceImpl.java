package com.school.health.service.impl;

import com.school.health.dto.request.HealthCampaignRequestDTO;
import com.school.health.dto.response.HealthCampaignResponseDTO;
import com.school.health.entity.HealthCheckCampaign;
import com.school.health.repository.HealthCheckCampaignRepository;
import com.school.health.service.HealthCheckCampaignService;

public class HealthCheckCampaignServiceImpl implements HealthCheckCampaignService {
    HealthCheckCampaignRepository healthCheckCampaignRepository;

    @Override
    public HealthCampaignResponseDTO createCampaign(HealthCampaignRequestDTO healthCampaignRequestDTO) {

        HealthCheckCampaign healthCheckCampaign = new HealthCheckCampaign();
        healthCheckCampaign.setCampaignName(healthCampaignRequestDTO.getCampaignName());
        healthCheckCampaign.setDescription(healthCampaignRequestDTO.getDescription());
        healthCheckCampaign.setScheduledDate(healthCampaignRequestDTO.getScheduledDate());
        healthCheckCampaign.setStatus(healthCampaignRequestDTO.getStatus());

        HealthCheckCampaign savedCampaign = healthCheckCampaignRepository.save(healthCheckCampaign);

        HealthCampaignResponseDTO responseDTO = new HealthCampaignResponseDTO();
        responseDTO.setCampaignId(savedCampaign.getCampaignId());
        responseDTO.setCampaignName(savedCampaign.getCampaignName());
        responseDTO.setDescription(savedCampaign.getDescription());
        responseDTO.setScheduledDate(savedCampaign.getScheduledDate());
        responseDTO.setCreatedBy(savedCampaign.getCreatedBy());

        return responseDTO;
    }
}
