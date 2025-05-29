package com.school.health.dto.response;

import com.school.health.entity.HealthProfile;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class HealthProfileResponseDTO {
    private Long profileId;
    private Long studentId;

    private String allergies;
    private String chronicDiseases;
    private String treatmentHistory;
    private String eyeSight;
    private String hearing;
    private String bloodType;
    private double weight;
    private double height;
    private String notes;

    public static HealthProfileResponseDTO fromEntity(HealthProfile entity) {
        return HealthProfileResponseDTO.builder()
                .profileId(entity.getProfileId())
                .studentId(entity.getStudent().getStudentId()) // vì bạn dùng quan hệ @OneToOne
                .allergies(entity.getAllergies())
                .chronicDiseases(entity.getChronicDiseases())
                .treatmentHistory(entity.getTreatmentHistory())
                .eyeSight(entity.getEyeSight())
                .hearing(entity.getHearing())
                .bloodType(entity.getBloodType())
                .weight(entity.getWeight())
                .height(entity.getHeight())
                .notes(entity.getNotes())
                .build();
    }
}
