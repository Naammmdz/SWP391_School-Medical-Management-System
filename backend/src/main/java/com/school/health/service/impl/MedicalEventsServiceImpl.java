package com.school.health.service.impl;

import com.school.health.dto.request.MedicalEventsFiltersRequestDTO;
import com.school.health.dto.request.MedicalEventsRequestDTO;
import com.school.health.dto.response.MedicalEventsResponseDTO;
import com.school.health.entity.MedicalEvent;
import com.school.health.entity.Student;
import com.school.health.entity.User;
import com.school.health.enums.MedicalEventStatus;
import com.school.health.enums.Status;
import com.school.health.event.MedicalEventPendingConfirmationEvent;
import com.school.health.exception.ResourceNotFoundException;
import com.school.health.repository.MedicalEventsRepository;
import com.school.health.repository.StudentRepository;
import com.school.health.repository.UserRepository;
import com.school.health.service.MedicalEvents;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
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

    @Autowired
    private ApplicationEventPublisher publisher;

    @Override
    public MedicalEventsResponseDTO createMedicalEvents(int createBy, MedicalEventsRequestDTO dto) {
        MedicalEvent entity = new MedicalEvent();

        entity.setStudent(studentRepository.getReferenceById(dto.getStuId()));
        entity.setTitle(dto.getTitle());
        entity.setEventType(dto.getEventType());
        entity.setEventDate(dto.getEventDate());
        entity.setLocation(dto.getLocation());
        entity.setDescription(dto.getDescription());
        entity.setCreatedBy(userRepository.getReferenceById(createBy));
        entity.setRelatedMedicinesUsed(dto.getRelatedMedicinesUsed());
        entity.setNotes(dto.getNotes());
        entity.setHandlingMeasures(dto.getHandlingMeasures());
        entity.setSeverityLevel(dto.getSeverityLevel());
        entity.setStatus(dto.getStatus());

        medicalEventsRepository.save(entity);
        if (entity.getStatus().equals(MedicalEventStatus.PENDING_CONFIRMATION)){
            publisher.publishEvent(new MedicalEventPendingConfirmationEvent(entity));
        }
        return mapToResponseDTO(entity);
    }

    @Override
    public MedicalEventsResponseDTO getMedicalEvents(int id) {
        return mapToResponseDTO(
                medicalEventsRepository.findById(id)
                        .orElseThrow(() -> new ResourceNotFoundException("Medical Event Not Found")));
    }

    @Override
    public List<MedicalEventsResponseDTO> getAllMedicalEvents(MedicalEventsFiltersRequestDTO filters) {
        List<MedicalEvent> list = medicalEventsRepository.findByFilter(
                filters.getFrom(), filters.getTo(), filters.getEventType(), filters.getStuId(), filters.getCreatedBy()
        );

        return list.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public MedicalEventsResponseDTO updateMedicalEvents(int id, MedicalEventsRequestDTO dto) {
        MedicalEvent entity = medicalEventsRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medical Event Not Found"));

        if (dto.getStuId() != 0) {
            entity.setStudent(studentRepository.getReferenceById(dto.getStuId()));
        }

        if (dto.getTitle() != null && !dto.getTitle().isBlank()) {
            entity.setTitle(dto.getTitle());
        }

        if (dto.getEventType() != null && !dto.getEventType().isBlank()) {
            entity.setEventType(dto.getEventType());
        }

        if (dto.getEventDate() != null) {
            entity.setEventDate(dto.getEventDate());
        }

        if (dto.getLocation() != null && !dto.getLocation().isBlank()) {
            entity.setLocation(dto.getLocation());
        }

        if (dto.getDescription() != null && !dto.getDescription().isBlank()) {
            entity.setDescription(dto.getDescription());
        }

        if (dto.getRelatedMedicinesUsed() != null && !dto.getRelatedMedicinesUsed().isBlank()) {
            entity.setRelatedMedicinesUsed(dto.getRelatedMedicinesUsed());
        }

        if (dto.getNotes() != null && !dto.getNotes().isBlank()) {
            entity.setNotes(dto.getNotes());
        }

        if (dto.getHandlingMeasures() != null && !dto.getHandlingMeasures().isBlank()) {
            entity.setHandlingMeasures(dto.getHandlingMeasures());
        }

        if (dto.getSeverityLevel() != null) {
            entity.setSeverityLevel(dto.getSeverityLevel());
        }

        if (dto.getStatus() != null) {
            entity.setStatus(dto.getStatus());
        }

        medicalEventsRepository.save(entity);
        return mapToResponseDTO(entity);
    }

    @Override
    public MedicalEventsResponseDTO mapToResponseDTO(MedicalEvent event) {
        MedicalEventsResponseDTO dto = new MedicalEventsResponseDTO();

        dto.setId(event.getId());
        dto.setStuId(event.getStudent().getStudentId());
        dto.setTitle(event.getTitle());
        dto.setEventType(event.getEventType());
        dto.setEventDate(event.getEventDate());
        dto.setLocation(event.getLocation());
        dto.setDescription(event.getDescription());
        dto.setCreatedAt(event.getCreatedAt());
        dto.setCreatedBy(event.getCreatedBy().getUserId());
        dto.setRelatedMedicinesUsed(event.getRelatedMedicinesUsed());
        dto.setNotes(event.getNotes());
        dto.setHandlingMeasures(event.getHandlingMeasures());
        dto.setSeverityLevel(event.getSeverityLevel());
        dto.setStatus(event.getStatus());

        return dto;
    }
}
