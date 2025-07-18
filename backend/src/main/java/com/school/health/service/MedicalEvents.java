package com.school.health.service;

import com.school.health.dto.request.InventoryUsedInMedicalEventUpdateRequestDTO;
import com.school.health.dto.request.MedicalEventsFiltersRequestDTO;
import com.school.health.dto.request.MedicalEventsRequestDTO;
import com.school.health.dto.request.MedicalEventsUpdateRequestDTO;
import com.school.health.dto.response.MedicalEventsResponseDTO;
import com.school.health.entity.MedicalEvent;

import java.util.List;

public interface MedicalEvents {
    public MedicalEventsResponseDTO createMedicalEvents(int createBy, MedicalEventsRequestDTO medicalEventsRequestDTO);

    public MedicalEventsResponseDTO getMedicalEvents(int id);

    public List<MedicalEventsResponseDTO> getAllMedicalEvents(MedicalEventsFiltersRequestDTO medicalEventsRequestDTO);

    public MedicalEventsResponseDTO updateMedicalEvents(int id, MedicalEventsRequestDTO medicalEventsRequestDTO);

    public MedicalEventsResponseDTO mapToResponseDTO(MedicalEvent medicalEvent);

//    public MedicalEventsResponseDTO updateMedicalEvents(int id, MedicalEventsUpdateRequestDTO MedicalEventsUpdateRequestDTO);

    public List<MedicalEventsResponseDTO> getMedicalEventByStudentID(int id);

    public List<MedicalEventsResponseDTO> getAllMedicalEvents();

    public MedicalEventsResponseDTO updateStatusMedicalEvent(int id);

}