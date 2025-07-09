package com.school.health.service;

import com.school.health.dto.response.StudentResponseDTO;
import com.school.health.entity.Student;

import java.util.List;

public interface StudentService {

    List<StudentResponseDTO> getStudentsByParentId(Integer parentId);
    StudentResponseDTO getStudentById(Integer studentId);
    List<StudentResponseDTO> getStudentsWithoutHealthProfile();
    List<StudentResponseDTO> searchStudentsByName(String name);
    List<StudentResponseDTO> getStudentsByClassName(String className);
    StudentResponseDTO mapToResponseDTO(Student student);
    List<StudentResponseDTO> getAllStudents();
    List<String> getDistinctClassNames();
}
