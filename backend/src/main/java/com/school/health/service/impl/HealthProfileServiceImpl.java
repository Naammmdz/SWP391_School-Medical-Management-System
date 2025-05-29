package com.school.health.service.impl;

import com.school.health.entity.*;
import com.school.health.dto.request.HealthProfileParentRequestDTO;
import com.school.health.dto.response.HealthProfileResponseDTO;
import com.school.health.repository.*;
import com.school.health.service.HealthProfileService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HealthProfileServiceImpl implements HealthProfileService {

    private final StudentRepository studentRepository;
    private final HealthProfileRepository healthProfileRepository;

    @Override
    public HealthProfileResponseDTO updateHealthProfileForParent(Long studentId, HealthProfileParentRequestDTO dto, Users parent) {
        Students student = studentRepository.findById(studentId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy học sinh."));

        if (student.getParent().getUserId() != parent.getUserId()) {
            throw new AccessDeniedException("Bạn không có quyền chỉnh sửa học sinh này.");
        }

        HealthProfile profile = student.getHealthProfile();
        if (profile == null) {
            profile = new HealthProfile();
            profile.setStudent(student);
        }

        profile.setAllergies(dto.getAllergies());
        profile.setChronicDiseases(dto.getChronicDiseases());
        profile.setTreatmentHistory(dto.getTreatmentHistory());
        profile.setEyeSight(dto.getEyeSight());
        profile.setHearing(dto.getHearing());
        profile.setBloodType(dto.getBloodType());
        profile.setWeight(dto.getWeight());
        profile.setHeight(dto.getHeight());
        profile.setNotes(dto.getNotes());

        healthProfileRepository.save(profile);

        return HealthProfileResponseDTO.fromEntity(profile);
    }

    @Override
    public HealthProfileResponseDTO getHealthProfileForParent(Long studentId, Users parent) {
        Students student = studentRepository.findById(studentId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy học sinh."));
        if (student.getParent().getUserId() != parent.getUserId()) {
            throw new AccessDeniedException("Không có quyền truy cập.");
        }
        HealthProfile profile = student.getHealthProfile();
        if (profile == null) {
            throw new EntityNotFoundException("Chưa có hồ sơ sức khỏe.");
        }
        return HealthProfileResponseDTO.fromEntity(profile);
    }

    @Override
    public List<HealthProfileResponseDTO> getAllHealthProfilesForParent(Users parent) {
        List<Students> students = studentRepository.findAllByParent(parent);
        return students.stream()
                .map(Students::getHealthProfile)
                .filter(profile -> profile != null)
                .map(HealthProfileResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }
}
