package com.school.health.service;

import com.school.health.dto.request.HealthCampaignRequestDTO;
import com.school.health.dto.response.HealthCampaignResponseDTO;
import org.springframework.stereotype.Service;

@Service
public interface HealthCheckCampaignService {
    HealthCampaignResponseDTO createCampaign(HealthCampaignRequestDTO healthCampaignRequestDTO);
}
