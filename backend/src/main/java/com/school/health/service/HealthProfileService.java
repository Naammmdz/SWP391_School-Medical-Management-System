package com.school.health.service;

import com.school.health.entity.Users;
import com.school.health.dto.request.HealthProfileParentRequestDTO;
import com.school.health.dto.response.HealthProfileResponseDTO;

import java.util.List;

public interface HealthProfileService {
    HealthProfileResponseDTO getHealthProfileForParent(Long studentId, Users parent);
    HealthProfileResponseDTO updateHealthProfileForParent(Long studentId, HealthProfileParentRequestDTO dto, Users parent);

    // 👇 thêm mới để xem danh sách tất cả học sinh của phụ huynh
    List<HealthProfileResponseDTO> getAllHealthProfilesForParent(Users parent);
}
