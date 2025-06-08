package com.school.health.service;

import com.school.health.dto.request.CreateHealthProfileDTO;
import com.school.health.dto.request.HealthProfileFilterRequest;
import com.school.health.dto.request.UpdateHealthProfileDTO;
import com.school.health.dto.response.HealthProfileResponseDTO;
import com.school.health.entity.HealthProfile;
import com.school.health.entity.Student;

import java.util.List;

public interface HealthProfileService {

    HealthProfileResponseDTO createHealthProfile(Integer studentId, CreateHealthProfileDTO dto,Integer userId);
    HealthProfileResponseDTO updateHealthProfile(Integer studentId, UpdateHealthProfileDTO dto,Integer userId);
    HealthProfileResponseDTO getHealthProfileByStudentId(Integer studentId);
    List<HealthProfileResponseDTO> getHealthProfilesByParentId(Integer parentId);
    List<HealthProfileResponseDTO> getStudentsWithAllergies();
    List<HealthProfileResponseDTO> getStudentsWithChronicDiseases();
    void deleteHealthProfile(Integer studentId);
    HealthProfile mapToEntity(CreateHealthProfileDTO dto, Student student);
    void updateEntityFromDTO(HealthProfile entity, UpdateHealthProfileDTO dto);
    HealthProfileResponseDTO mapToResponseDTO(HealthProfile profile);
    List<HealthProfileResponseDTO> getAllHealthProfiles();
    List<HealthProfileResponseDTO> filterHealthProfiles(HealthProfileFilterRequest filterRequest);
}
