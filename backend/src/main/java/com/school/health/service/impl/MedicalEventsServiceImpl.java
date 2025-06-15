package com.school.health.service.impl;

import com.school.health.dto.request.MedicalEventsFiltersRequestDTO;
import com.school.health.dto.request.MedicalEventsRequestDTO;
import com.school.health.dto.response.MedicalEventsResponseDTO;
import com.school.health.entity.MedicalEvent;
import com.school.health.entity.Student;
import com.school.health.entity.User;
import com.school.health.repository.MedicalEventsRepository;
import com.school.health.repository.StudentRepository;
import com.school.health.repository.UserRepository;
import com.school.health.service.MedicalEvents;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MedicalEventsServiceImpl implements MedicalEvents {
    @Autowired
    private MedicalEventsRepository medicalEventsRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private StudentRepository studentRepository;



    @Override
    public MedicalEventsResponseDTO createMedicalEvents(int createBy, MedicalEventsRequestDTO medicalEventsRequestDTO) {
        MedicalEvent medicalEvent = new MedicalEvent();
        medicalEvent.setStudent(studentRepository.getReferenceById(medicalEventsRequestDTO.getStuId()));
        medicalEvent.setEventType(medicalEventsRequestDTO.getEventType());
        medicalEvent.setDescription(medicalEventsRequestDTO.getDescription());
        medicalEvent.setCreatedBy(userRepository.getReferenceById(createBy));
        medicalEvent.setRelatedMedicinesUsed(medicalEventsRequestDTO.getRelatedMedicinesUsed());
        medicalEvent.setNotes(medicalEventsRequestDTO.getNotes());
        medicalEventsRepository.save(medicalEvent);
        return mapToResponseDTO(medicalEvent);

    }

    @Override
    public MedicalEventsResponseDTO getMedicalEvents(int id) {
        return mapToResponseDTO(medicalEventsRepository.getReferenceById(id));
    }

    @Override
    public List<MedicalEventsResponseDTO> getAllMedicalEvents(MedicalEventsFiltersRequestDTO medicalEventsFiltersRequestDTO) {
        List<MedicalEvent> list = medicalEventsRepository.findByFilter(medicalEventsFiltersRequestDTO.getFrom(), medicalEventsFiltersRequestDTO.getTo(), medicalEventsFiltersRequestDTO.getEventType(), medicalEventsFiltersRequestDTO.getStuId(), medicalEventsFiltersRequestDTO.getCreatedBy());
        return list.stream().map(x -> mapToResponseDTO(x)).collect(Collectors.toList());
    }

    @Override
    public MedicalEventsResponseDTO updateMedicalEvents(int id, MedicalEventsRequestDTO dto) {
        MedicalEvent entity = medicalEventsRepository.getReferenceById(id);

        // Cập nhật có điều kiện
        if (dto.getStuId()!= 0) { // int mặc định là 0
            Student student = studentRepository.getReferenceById(dto.getStuId());
            entity.setStudent(student);
        }

        if (dto.getEventType() != null && !dto.getEventType().isBlank()) {
            entity.setEventType(dto.getEventType());
        }

        if (dto.getDescription() != null && !dto.getDescription().isBlank()) {
            entity.setDescription(dto.getDescription());
        }

        if (dto.getCreatedAt() != null) {
            entity.setCreatedAt(dto.getCreatedAt());
        }

        if (dto.getRelatedMedicinesUsed() != null && !dto.getRelatedMedicinesUsed().isBlank()) {
            entity.setRelatedMedicinesUsed(dto.getRelatedMedicinesUsed());
        }

        if (dto.getNotes() != null && !dto.getNotes().isBlank()) {
            entity.setNotes(dto.getNotes());
        }

        medicalEventsRepository.save(entity);
        return mapToResponseDTO(entity);
    }

    @Override
    public MedicalEventsResponseDTO mapToResponseDTO(MedicalEvent medicalEvent) {
        MedicalEventsResponseDTO medicalEventsResponseDTO = new MedicalEventsResponseDTO();
        medicalEventsResponseDTO.setId(medicalEvent.getId());
        medicalEventsResponseDTO.setStuId(medicalEvent.getStudent().getStudentId());
        medicalEventsResponseDTO.setEventType(medicalEvent.getEventType());
        medicalEventsResponseDTO.setDescription(medicalEvent.getDescription());
        medicalEventsResponseDTO.setCreatedAt(medicalEvent.getCreatedAt());
        medicalEventsResponseDTO.setCreatedBy(medicalEvent.getCreatedBy().getUserId());
        medicalEventsResponseDTO.setRelatedMedicinesUsed(medicalEvent.getRelatedMedicinesUsed());
        medicalEventsResponseDTO.setNotes(medicalEvent.getNotes());
        return medicalEventsResponseDTO;
    }
    //create MedicalEvents

}
