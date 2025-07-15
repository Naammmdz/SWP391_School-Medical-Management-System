# Medical Event Class Selection and Student List Implementation

## Overview

This implementation enhances the Medical Event creation system with a class selection popup and student list functionality. Users can select a class to view all students in that class, then select multiple students to add to the medical event.

## Features

### Backend Features

1. **Enhanced Student Repository**
   - `findByClassName(String className)` - Get students by class name
   - `findDistinctClassNames()` - Get all unique class names
   - Active student filtering

2. **Medical Event Management**
   - Support for multiple students per medical event
   - Validation for required student selection
   - Proper error handling and logging

3. **API Endpoints**
   - `GET /api/admin/students/classes` - Get all class names
   - `GET /api/admin/students/class/{className}` - Get students in a specific class
   - `POST /api/nurse/medical-events` - Create medical event with students

### Frontend Features

1. **Enhanced Medical Event Form**
   - Class selection dropdown
   - Student selection modal
   - Multiple student selection with visual feedback
   - Real-time validation

2. **Student Selection Modal**
   - Class-based student filtering
   - Checkbox selection for multiple students
   - Student information display (ID, name, DOB, gender)
   - Confirmation and cancellation actions

3. **User Experience**
   - Responsive design
   - Loading states
   - Error handling
   - Visual feedback for selected students

## Implementation Details

### Backend Structure

```
backend/
├── controller/
│   ├── MedicalEventsController.java (Enhanced)
│   └── StudentAdminController.java (Enhanced)
├── service/
│   └── impl/
│       ├── MedicalEventsServiceImpl.java
│       └── StudentServiceImpl.java
├── repository/
│   └── StudentRepository.java (Enhanced)
├── entity/
│   ├── MedicalEvent.java
│   └── Student.java
└── dto/
    ├── request/
    │   └── MedicalEventsRequestDTO.java
    └── response/
        ├── MedicalEventsResponseDTO.java
        └── StudentResponseDTO.java
```

### Frontend Structure

```
frontend/
├── pages/
│   └── medical/
│       └── MedicalEvent/
│           ├── MedicalEvents.jsx (Enhanced)
│           └── MedicalEvents.css (Enhanced)
├── components/
│   ├── StudentSelectionModal.jsx
│   ├── StudentSelectionModal.css
│   ├── MedicalEventDemo.jsx (New)
│   └── MedicalEventDemo.css (New)
└── services/
    ├── MedicalEventService.jsx
    └── StudentService.jsx
```

## Usage Flow

### 1. Create Medical Event

1. User navigates to Medical Events page
2. Click "Thêm sự cố y tế" (Add Medical Event)
3. Fill in basic information (title, event type, date, location)

### 2. Select Students

1. Select a class from the dropdown
2. Click "Chọn học sinh từ lớp [Class Name]"
3. Student Selection Modal opens showing all students in the selected class
4. Select multiple students using checkboxes
5. Click "Xác nhận" to add selected students to the medical event

### 3. Complete Medical Event

1. Fill in additional details (description, severity, handling measures)
2. Add notes if needed
3. Submit the form

## Code Examples

### Backend - Student Repository Query

```java
@Query("SELECT DISTINCT s.className FROM Student s WHERE s.className IS NOT NULL AND s.isActive = true ORDER BY s.className")
List<String> findDistinctClassNames();

List<Student> findByClassName(String className);
```

### Backend - Medical Event Creation

```java
@PreAuthorize("hasRole('NURSE')")
@PostMapping("/api/nurse/medical-events")
public ResponseEntity<MedicalEventsResponseDTO> addMedicalEvent(
    @RequestBody @Valid MedicalEventsRequestDTO medicalEventsRequestDTO, 
    Authentication authentication) {
    
    UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();
    Integer userId = userPrincipal.getId();
    
    // Validate that at least one student is selected
    if (medicalEventsRequestDTO.getStuId() == null || medicalEventsRequestDTO.getStuId().isEmpty()) {
        throw new IllegalArgumentException("Phải chọn ít nhất một học sinh cho sự cố y tế");
    }
    
    return ResponseEntity.ok(medicalEventsService.createMedicalEvents(userId, medicalEventsRequestDTO));
}
```

### Frontend - Class Selection

```jsx
const handleClassChange = (e) => {
  setSelectedClass(e.target.value);
};

const handleOpenStudentModal = () => {
  if (selectedClass) {
    setStudentSelectionModalOpen(true);
  }
};
```

### Frontend - Student Selection Modal

```jsx
<StudentSelectionModal
  isOpen={studentSelectionModalOpen}
  onClose={handleCloseStudentModal}
  onConfirm={handleConfirmStudentSelection}
  selectedStudentIds={currentEvent.stuId}
  availableClasses={availableClasses}
/>
```

## Database Schema

### MedicalEvent Table
- `EventId` (Primary Key)
- `Title` (Medical event title)
- `EventType` (Type of medical event)
- `EventDate` (When the event occurred)
- `Location` (Where the event occurred)
- `Description` (Detailed description)
- `CreatedBy` (Foreign Key to User)
- `SeverityLevel` (Enum: MINOR, MODERATE, MAJOR, CRITICAL)
- `Status` (Enum: IN_PROGRESS, COMPLETED)

### Student Table
- `StudentId` (Primary Key)
- `FullName` (Student's full name)
- `DOB` (Date of birth)
- `Gender` (Gender)
- `ClassName` (Class name)
- `ParentId` (Foreign Key to User)
- `IsActive` (Boolean for soft delete)

### medical_event_student Table (Many-to-Many)
- `EventId` (Foreign Key to MedicalEvent)
- `StudentId` (Foreign Key to Student)

## Security Considerations

1. **Role-Based Access Control**
   - Only NURSE role can create medical events
   - Only ADMIN and NURSE roles can access student data

2. **Data Validation**
   - Required field validation
   - Student existence validation
   - Class existence validation

3. **Error Handling**
   - Proper exception handling
   - User-friendly error messages
   - Logging for debugging

## Testing

### Backend Testing
- Unit tests for service methods
- Integration tests for API endpoints
- Repository tests for custom queries

### Frontend Testing
- Component testing for form validation
- Modal functionality testing
- User interaction testing

## Deployment Notes

1. **Environment Configuration**
   - Ensure proper API URLs in environment files
   - Configure CORS for frontend-backend communication

2. **Database Migration**
   - Run migrations for any schema changes
   - Update seed data if needed

3. **Dependencies**
   - All required dependencies are included in package.json and pom.xml
   - No additional external dependencies required

## Future Enhancements

1. **Bulk Operations**
   - Select all students in a class
   - Copy students from previous medical events

2. **Search Functionality**
   - Search students by name within selected class
   - Filter students by various criteria

3. **Advanced UI**
   - Drag and drop student selection
   - Student photo display
   - Class statistics

4. **Reporting**
   - Medical event reports by class
   - Student involvement statistics
   - Class-wise incident reports

## Troubleshooting

### Common Issues

1. **Students not loading**
   - Check if class name is properly encoded in URL
   - Verify student service authentication

2. **Modal not opening**
   - Ensure class is selected first
   - Check browser console for JavaScript errors

3. **Form submission errors**
   - Verify at least one student is selected
   - Check all required fields are filled

### Performance Considerations

1. **Large Class Sizes**
   - Consider pagination for classes with many students
   - Implement search functionality for better user experience

2. **Database Optimization**
   - Add indexes on frequently queried columns
   - Optimize queries for large datasets

This implementation provides a complete solution for class-based student selection in medical events, with proper backend validation, frontend user experience, and comprehensive error handling.
