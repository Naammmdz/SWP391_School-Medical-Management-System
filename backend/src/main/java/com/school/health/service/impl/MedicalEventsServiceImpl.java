package com.school.health.service.impl;

import com.school.health.dto.request.*;
import com.school.health.dto.response.InventoryUsedLogDTO;
import com.school.health.dto.response.MedicalEventsResponseDTO;
import com.school.health.entity.InventoryUsedLog;
import com.school.health.entity.MedicalEvent;
import com.school.health.entity.Student;
import com.school.health.enums.MedicalEventStatus;
import com.school.health.event.noti.MedicalEventNotificationEvent;
import com.school.health.event.usageInventory.InventoryUsedEvent;
import com.school.health.exception.ResourceNotFoundException;
import com.school.health.repository.InventoryUsedRepo;
import com.school.health.repository.MedicalEventsRepository;
import com.school.health.repository.StudentRepository;
import com.school.health.repository.UserRepository;
import com.school.health.repository.InventoryRepo;
import com.school.health.service.MedicalEvents;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.school.health.service.impl.InventoryUsedServiceImpl;

import java.util.ArrayList;
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

    @Autowired
    private InventoryUsedRepo  inventoryUsedRepo;
    
    @Autowired
    private InventoryRepo inventoryRepo;
    
    @Autowired
    private InventoryUsedServiceImpl inventoryUsedService;

    @Override
    @Transactional
    public MedicalEventsResponseDTO createMedicalEvents(int createBy, MedicalEventsRequestDTO dto) {
        try {
            System.out.println("=== CREATING MEDICAL EVENT ===");
            System.out.println("Student IDs: " + dto.getStuId());
            System.out.println("Inventory items: " + dto.getRelatedItemUsed());
            
            MedicalEvent entity = new MedicalEvent();

            entity.setTitle(dto.getTitle());
            
            // Add students with proper error handling (following project patterns)
            if (dto.getStuId() != null && !dto.getStuId().isEmpty()) {
                List<Student> students = new ArrayList<>();
                for (Integer stuId : dto.getStuId()) {
                    Student s = studentRepository.findById(stuId)
                            .orElseThrow(() -> new RuntimeException("Không tìm thấy học sinh ID: " + stuId));
                    students.add(s);
                    System.out.println("Added student: " + s.getFullName() + " (ID: " + stuId + ")");
                }
                entity.setStudentList(students);
            }
            
            entity.setCreatedBy(userRepository.getReferenceById(createBy));
            entity.setEventType(dto.getEventType());
            entity.setEventDate(dto.getEventDate());
            entity.setLocation(dto.getLocation());
            entity.setDescription(dto.getDescription());
            entity.setNotes(dto.getNotes());
            entity.setHandlingMeasures(dto.getHandlingMeasures());
            entity.setSeverityLevel(dto.getSeverityLevel());
            entity.setStatus(dto.getStatus());
            
            // Save the medical event first
            MedicalEvent savedEntity = medicalEventsRepository.save(entity);
            if (dto.getRelatedItemUsed() != null) {
                for(InventoryUsedInMedicalEventRequestDTO itemUsed : dto.getRelatedItemUsed()) {
                    // Tạo cái Inventory Used
                    publisher.publishEvent(new InventoryUsedEvent(entity.getId(),itemUsed));

                }
            }
            
            // Publish notification event
            publisher.publishEvent(new MedicalEventNotificationEvent(savedEntity));
            

            return mapToResponseDTO(savedEntity);
            
        } catch (Exception e) {
            System.err.println("Error creating medical event: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to create medical event: " + e.getMessage(), e);
        }
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
                filters.getFrom(), filters.getTo(), filters.getEventType(), filters.getStuId(), filters.getCreatedBy(), filters.getStatus(), filters.getSearchTerm()
        );
        return list.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<MedicalEventsResponseDTO> getAllMedicalEvents( ) {
        List<MedicalEvent> list = medicalEventsRepository.findAll();
        return list.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public MedicalEventsResponseDTO updateStatusMedicalEvent(int id) {
        MedicalEvent entity = medicalEventsRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medical Event Not Found"));
        if (entity.getStatus().equals(MedicalEventStatus.PROCESSING)) {
            entity.setStatus(MedicalEventStatus.RESOLVED);
        } else {
            entity.setStatus(MedicalEventStatus.PROCESSING);
        }
        medicalEventsRepository.save(entity);
        return mapToResponseDTO(entity);

    }



    @Override
    public MedicalEventsResponseDTO updateMedicalEvents(int id, MedicalEventsRequestDTO dto) {
        MedicalEvent entity = medicalEventsRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medical Event Not Found"));

        if (dto.getStuId() != null) {
            entity.getStudentList().clear();
            dto.getStuId().forEach(integer -> entity.addStudent(studentRepository.getReferenceById(integer)));
        }

        if (dto.getRelatedItemUsed() != null) {
            entity.getRelatedInventoryUsed().clear();
            for(InventoryUsedInMedicalEventRequestDTO itemUsed : dto.getRelatedItemUsed()) {
                // Update cái Inventory Used
                publisher.publishEvent(new InventoryUsedEvent(entity.getId(),itemUsed));


            }
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

//    @Override
//    public MedicalEventsResponseDTO updateMedicalEvents(int id, MedicalEventsUpdateRequestDTO dto) {
//        MedicalEvent entity = medicalEventsRepository.findById(id)
//                .orElseThrow(() -> new ResourceNotFoundException("Medical Event Not Found"));
//
//        if (dto.getStuId() != null) {
//            entity.getStudentList().clear();
//            dto.getStuId().forEach(integer -> entity.addStudent(studentRepository.getReferenceById(integer)));
//        }
//
//
//        if (dto.getTitle() != null && !dto.getTitle().isBlank()) {
//            entity.setTitle(dto.getTitle());
//        }
//
//        if (dto.getEventType() != null && !dto.getEventType().isBlank()) {
//            entity.setEventType(dto.getEventType());
//        }
//
//        if (dto.getEventDate() != null) {
//            entity.setEventDate(dto.getEventDate());
//        }
//
//        if (dto.getLocation() != null && !dto.getLocation().isBlank()) {
//            entity.setLocation(dto.getLocation());
//        }
//
//        if (dto.getDescription() != null && !dto.getDescription().isBlank()) {
//            entity.setDescription(dto.getDescription());
//        }
//
//
//        if (dto.getNotes() != null && !dto.getNotes().isBlank()) {
//            entity.setNotes(dto.getNotes());
//        }
//
//        if (dto.getHandlingMeasures() != null && !dto.getHandlingMeasures().isBlank()) {
//            entity.setHandlingMeasures(dto.getHandlingMeasures());
//        }
//
//        if (dto.getSeverityLevel() != null) {
//            entity.setSeverityLevel(dto.getSeverityLevel());
//        }
//
//        if (dto.getStatus() != null) {
//            entity.setStatus(dto.getStatus());
//        }
//        if (dto.getRelatedItemUsed() != null) {
//            entity.getRelatedInventoryUsed().clear();
//            for(InventoryUsedInMedicalEventUpdateRequestDTO itemUsed : dto.getRelatedItemUsed()) {
//                // Tạo cái Inventory Used
////                publisher.publishEvent(new InventoryUsedUpdateEvent(entity.getId(),itemUsed));
//
//            }
//        }
//
//        medicalEventsRepository.save(entity);
//        return mapToResponseDTO(entity);
//    }

    @Override
    public List<MedicalEventsResponseDTO> getMedicalEventByStudentID(int id) {
        List<MedicalEvent> list = medicalEventsRepository.findByStudentId(id);
        return list.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public MedicalEventsResponseDTO mapToResponseDTO(MedicalEvent event) {
        MedicalEventsResponseDTO dto = new MedicalEventsResponseDTO();

        dto.setId(event.getId());
        event.getStudentList().forEach(student -> dto.addStuId(student.getStudentId()));
        dto.setTitle(event.getTitle());
        dto.setEventType(event.getEventType());
        dto.setEventDate(event.getEventDate());
        dto.setLocation(event.getLocation());
        dto.setDescription(event.getDescription());
        dto.setCreatedAt(event.getCreatedAt());
        dto.setCreatedBy(event.getCreatedBy().getUserId());
        dto.setNotes(event.getNotes());
        dto.setHandlingMeasures(event.getHandlingMeasures());
        dto.setSeverityLevel(event.getSeverityLevel());
        dto.setStatus(event.getStatus());

        List<InventoryUsedLogDTO> dtoList = new ArrayList<>();

        if (inventoryUsedRepo.findByEvent(event.getId()) != null) {

            for (InventoryUsedLog log : inventoryUsedRepo.findByEvent(event.getId())) {
                if (log != null && log.getItem() != null) {
                    InventoryUsedLogDTO dtoItem = new InventoryUsedLogDTO();
                    dtoItem.setId(log.getId());
                    dtoItem.setMedicineId(log.getItem().getId());
                    dtoItem.setMedicineName(log.getItem().getName());
                    dtoItem.setQuantityUsed(log.getQuantityUsed());
                    dtoItem.setUnit(log.getItem().getUnit());          // nếu Inventory có getUnit()
                    dtoItem.setUsageNote(log.getNotes());                    // nếu InventoryUsedLog có note
                    dtoList.add(dtoItem);
                }
            }
        }
        dto.setRelatedMedicinesUsed(dtoList);
        return dto;
    }
}
