package com.school.health.service.impl;

import com.school.health.dto.request.HealthCampaignRequestDTO;
import com.school.health.dto.response.HealthCampaignResponseDTO;
import com.school.health.entity.HealthCheckCampaign;
import com.school.health.repository.HealthCheckCampaignRepository;
import com.school.health.service.HealthCheckCampaignService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class HealthCheckCampaignServiceImpl implements HealthCheckCampaignService {
    private final HealthCheckCampaignRepository healthCheckCampaignRepository;

    @Override
    public HealthCampaignResponseDTO createCampaign(HealthCampaignRequestDTO healthCampaignRequestDTO, int createdBy, int approvedBy) {

        HealthCheckCampaign healthCheckCampaign = new HealthCheckCampaign();
        healthCheckCampaign.setCampaignName(healthCampaignRequestDTO.getCampaignName());
        healthCheckCampaign.setDescription(healthCampaignRequestDTO.getDescription());
        healthCheckCampaign.setScheduledDate(healthCampaignRequestDTO.getScheduledDate());
        healthCheckCampaign.setStatus(healthCampaignRequestDTO.getStatus());
        healthCheckCampaign.setCreatedBy(createdBy);
        healthCheckCampaign.setApprovedBy(approvedBy);

        HealthCheckCampaign savedCampaign = healthCheckCampaignRepository.save(healthCheckCampaign);

        HealthCampaignResponseDTO responseDTO = new HealthCampaignResponseDTO();
        responseDTO.setCampaignName(savedCampaign.getCampaignName());
        responseDTO.setDescription(savedCampaign.getDescription());
        responseDTO.setScheduledDate(savedCampaign.getScheduledDate());
        responseDTO.setCreatedBy(savedCampaign.getCreatedBy());
        responseDTO.setApprovedBy(savedCampaign.getApprovedBy());
        responseDTO.setStatus(savedCampaign.getStatus());

        return responseDTO;
    }
}
