package com.school.health.service.impl;

import com.school.health.dto.request.CreateHealthProfileDTO;
import com.school.health.dto.request.HealthProfileFilterRequest;
import com.school.health.dto.request.UpdateHealthProfileDTO;
import com.school.health.entity.*;
import com.school.health.dto.response.HealthProfileResponseDTO;
import com.school.health.exception.DuplicateResourceException;
import com.school.health.exception.ResourceNotFoundException;
import com.school.health.repository.*;
import com.school.health.service.HealthProfileService;
import com.school.health.service.MailService;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;



@Service
@Slf4j
@RequiredArgsConstructor
public class HealthProfileServiceImpl implements HealthProfileService {
    private final HealthProfileRepository healthProfileRepository;
    private final StudentRepository studentRepository;
    private final MailService mailService;

    @Override
    public HealthProfileResponseDTO createHealthProfile(Integer studentId, CreateHealthProfileDTO dto, Integer userId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy học sinh với ID: " + studentId));
        // Kiểm tra học sinh đã có hồ sơ sức khỏe chưa
        if (healthProfileRepository.findByStudentStudentId(studentId).isPresent()) {
            throw new DuplicateResourceException("Học sinh này đã có hồ sơ sức khỏe rồi!");
        }
        HealthProfile healthProfile = mapToEntity(dto, student);
        HealthProfile savedProfile = healthProfileRepository.save(healthProfile);
        if (userId != null) {
            User user = new User();
            user.setUserId(userId);
            healthProfile.setUpdatedBy(user);
//            mailService.sendConfirmLink("health-profile", student.get().getEmail(), savedProfile.getProfileId());
        }
        return mapToResponseDTO(savedProfile);
    }

    //Cập nhật hồ sơ sức khỏe
    @Override
    public HealthProfileResponseDTO updateHealthProfile(Integer studentId, UpdateHealthProfileDTO dto, Integer userId) {
        // Tìm hồ sơ hiện tại
        HealthProfile existingProfile = healthProfileRepository.findByStudentStudentId(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy hồ sơ sức khỏe cho học sinh với ID: " + studentId));

        // Cập nhật thông tin (chỉ cập nhật các field không null)
        updateEntityFromDTO(existingProfile, dto);
        if (userId != null) {
            User user = new User();
            user.setUserId(userId);
            existingProfile.setUpdatedBy(user);
        }
        // Cập nhật người sửa
        // Lưu vào database
        HealthProfile updatedProfile = healthProfileRepository.save(existingProfile);
        return mapToResponseDTO(updatedProfile);
    }

    //Lấy hồ sơ sức khỏe theo student ID
    @Override
    @Transactional(readOnly = true)
    public HealthProfileResponseDTO getHealthProfileByStudentId(Integer studentId) {
        HealthProfile profile = healthProfileRepository.findByStudentStudentId(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy hồ sơ sức khỏe cho học sinh với ID: " + studentId));

        return mapToResponseDTO(profile);
    }

    //Lấy tất cả hồ sơ sức khỏe của các con thuộc parent ID
    @Transactional(readOnly = true)
    @Override
    public List<HealthProfileResponseDTO> getHealthProfilesByParentId(Integer parentId) {
        List<Student> students = studentRepository.findStudentsWithHealthProfileByParentId(parentId);

        return students.stream()
                .map(student -> mapToResponseDTO(student.getHealthProfile()))
                .collect(Collectors.toList());
    }

    //Lấy danh sách học sinh có dị ứng
    @Transactional(readOnly = true)
    @Override
    public List<HealthProfileResponseDTO> getStudentsWithAllergies() {
        List<HealthProfile> profiles = healthProfileRepository.findProfilesWithAllergies();

        return profiles.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    //Lấy danh sách học sinh có bệnh mãn tính
    @Transactional(readOnly = true)
    @Override
    public List<HealthProfileResponseDTO> getStudentsWithChronicDiseases() {
        List<HealthProfile> profiles = healthProfileRepository.findProfilesWithChronicDiseases();

        return profiles.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    // Xóa hồ sơ sức khỏe của học sinh theo studentId
    @Override
    public void deleteHealthProfile(Integer studentId) {
        HealthProfile profile = healthProfileRepository.findByStudentStudentId(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy hồ sơ sức khỏe cho học sinh với ID: " + studentId));

        healthProfileRepository.delete(profile);
    }

    @Override
    public HealthProfile mapToEntity(CreateHealthProfileDTO dto, Student student) {
        HealthProfile profile = new HealthProfile();
        profile.setStudent(student);
        profile.setAllergies(dto.getAllergies());
        profile.setChronicDiseases(dto.getChronicDiseases());
        profile.setTreatmentHistory(dto.getTreatmentHistory());
        profile.setEyesight(dto.getEyesight());
        profile.setHearing(dto.getHearing());
        profile.setBloodType(dto.getBloodType());
        profile.setWeight(dto.getWeight());
        profile.setHeight(dto.getHeight());
        profile.setNotes(dto.getNotes());
        profile.setUpdatedAt(LocalDateTime.now());
        return profile;
    }

    @Override
    public void updateEntityFromDTO(HealthProfile entity, UpdateHealthProfileDTO dto) {
        if (dto.getAllergies() != null) {
            entity.setAllergies(dto.getAllergies());
        }
        if (dto.getChronicDiseases() != null) {
            entity.setChronicDiseases(dto.getChronicDiseases());
        }
        if (dto.getTreatmentHistory() != null) {
            entity.setTreatmentHistory(dto.getTreatmentHistory());
        }
        if (dto.getEyesight() != null) {
            entity.setEyesight(dto.getEyesight());
        }
        if (dto.getHearing() != null) {
            entity.setHearing(dto.getHearing());
        }
        if (dto.getBloodType() != null) {
            entity.setBloodType(dto.getBloodType());
        }
        if (dto.getWeight() != null) {
            entity.setWeight(dto.getWeight());
        }
        if (dto.getHeight() != null) {
            entity.setHeight(dto.getHeight());
        }
        if (dto.getNotes() != null) {
            entity.setNotes(dto.getNotes());
        }
        entity.setUpdatedAt(LocalDateTime.now());
    }



    @Override
    public List<HealthProfileResponseDTO> getAllHealthProfiles() {
        List<HealthProfile> profiles = healthProfileRepository.findAll();
        return profiles.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<HealthProfileResponseDTO> filterHealthProfiles(HealthProfileFilterRequest filterRequest) {
        Specification<HealthProfile> specification = (root, query, cb) -> {
            Predicate predicate = cb.conjunction();

            if (filterRequest.getId() != null) {
                predicate = cb.and(predicate, cb.equal(root.get("profileId"), filterRequest.getId()));
            }
            if (filterRequest.getName() != null) {
                predicate = cb.and(predicate, cb.like(cb.lower(root.get("student").get("fullName")),
                        "%" + filterRequest.getName().toLowerCase() + "%"));
            }
            if (filterRequest.getClassName() != null) {
                predicate = cb.and(predicate, cb.equal(cb.lower(root.get("student").get("className")),
                        filterRequest.getClassName().toLowerCase()));
            }
            if (filterRequest.getGender() != null) {
                predicate = cb.and(predicate, cb.equal(cb.lower(root.get("student").get("gender")),
                        filterRequest.getGender().toLowerCase()));
            }

            return predicate;


        };
        List<HealthProfile> healthProfiles = healthProfileRepository.findAll(specification);
        return healthProfiles.stream()
                .map(this::mapToResponseDTO) // Convert entity to DTO
                .collect(Collectors.toList());
}
    @Override
    public HealthProfileResponseDTO mapToResponseDTO(HealthProfile profile) {
        HealthProfileResponseDTO dto = new HealthProfileResponseDTO();
        dto.setProfileId(profile.getProfileId());
        dto.setStudentId(profile.getStudent().getStudentId());
        dto.setStudentName(profile.getStudent().getFullName());
        dto.setStudentClass(profile.getStudent().getClassName());
        dto.setStudentGender(profile.getStudent().getGender());
        dto.setAllergies(profile.getAllergies());
        dto.setChronicDiseases(profile.getChronicDiseases());
        dto.setTreatmentHistory(profile.getTreatmentHistory());
        dto.setEyesight(profile.getEyesight());
        dto.setHearing(profile.getHearing());
        dto.setBloodType(profile.getBloodType());
        dto.setWeight(profile.getWeight());
        dto.setHeight(profile.getHeight());
        dto.setNotes(profile.getNotes());
        dto.setUpdatedAt(profile.getUpdatedAt());
        return dto;
    }
}


