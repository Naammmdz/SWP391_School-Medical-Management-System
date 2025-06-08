package com.school.health.service.impl;

import com.school.health.dto.response.HealthProfileResponseDTO;
import com.school.health.entity.HealthProfile;
import org.springframework.stereotype.Component;

@Component
public class HealthProfileMapper {

    public HealthProfileResponseDTO toDTO(HealthProfile healthProfile) {
        if (healthProfile == null) {
            return null;
        }

        HealthProfileResponseDTO dto = new HealthProfileResponseDTO();
        dto.setProfileId(healthProfile.getProfileId());
        dto.setStudentId(healthProfile.getStudent() != null ? healthProfile.getStudent().getStudentId() : null);
        dto.setStudentName(healthProfile.getStudent() != null ? healthProfile.getStudent().getFullName() : null);
        dto.setAllergies(healthProfile.getAllergies());
        dto.setChronicDiseases(healthProfile.getChronicDiseases());
        dto.setTreatmentHistory(healthProfile.getTreatmentHistory());
        dto.setEyesight(healthProfile.getEyesight());
        dto.setHearing(healthProfile.getHearing());
        dto.setBloodType(healthProfile.getBloodType());
        dto.setWeight(healthProfile.getWeight());
        dto.setHeight(healthProfile.getHeight());
        dto.setNotes(healthProfile.getNotes());
        dto.setUpdatedAt(healthProfile.getUpdatedAt());
        return dto;
    }
}