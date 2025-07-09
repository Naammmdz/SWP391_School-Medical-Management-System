# Vaccination Campaign Student Management API Implementation

## Overview
This document outlines the implementation of two new API endpoints for vaccination campaign student management and their corresponding frontend integration.

## Backend APIs Added

### 1. Get All Students in Campaign (by Target Group)
- **Endpoint**: `GET /api/vaccination-campaigns/{campaignId}/all-students`
- **Description**: Returns all students eligible to participate in a vaccination campaign based on the target group
- **Authorization**: Requires PARENT, ADMIN, or NURSE role
- **Response**: List of students who meet the campaign's target group criteria

### 2. Get Students with Vaccination Status
- **Endpoint**: `GET /api/vaccination-campaigns/{campaignId}/students-with-status`
- **Description**: Returns all students with their detailed vaccination status including parent confirmation and vaccination results
- **Authorization**: Requires PARENT, ADMIN, or NURSE role
- **Response**: List of students with vaccination status, parent confirmation, and results

## Frontend Implementation

### 1. VaccinationService Updates
**File**: `src/services/VaccinationService.jsx`

Added two new service methods:
```javascript
// Get all students that can participate in a campaign (based on target group)
getAllStudentsInCampaign: (campaignId, config) => {
    return axios.get(`${vaccinationApiUrl}/${campaignId}/all-students`, config);
},

// Get all students with their vaccination status in a campaign
getStudentsWithVaccinationStatus: (campaignId, config) => {
    return axios.get(`${vaccinationApiUrl}/${campaignId}/students-with-status`, config);
},
```

### 2. New Components Created

#### AllStudentsInCampaign.jsx
**File**: `src/components/vaccination/AllStudentsInCampaign.jsx`
- **Purpose**: Display eligible students for a vaccination campaign
- **Features**:
  - Fetches students based on target group
  - Shows student information (ID, name, class, gender, DOB)
  - Responsive table with pagination
  - Student count statistics
  - Loading states and error handling

#### StudentsWithVaccinationStatus.jsx
**File**: `src/components/vaccination/StudentsWithVaccinationStatus.jsx`
- **Purpose**: Display students with their detailed vaccination status
- **Features**:
  - Shows parent confirmation status (confirmed/declined/pending)
  - Displays vaccination results (success/failed/delayed/pending)
  - Comprehensive statistics dashboard
  - Color-coded status indicators
  - Vaccination date tracking
  - Notes and additional information

### 3. Demo Page
**File**: `src/pages/health/Vaccination/VaccinationStudentDemo.jsx`
- **Purpose**: Demonstration page for testing the new APIs
- **Features**:
  - Campaign ID input for testing
  - Tabbed interface showing both components
  - API documentation and endpoint information
  - Real-time campaign information display

### 4. Routing
**File**: `src/App.jsx`
- Added route: `/demo-vaccination-students` for the demo page

## Key Features

### Statistics Dashboard
Both components include comprehensive statistics:
- Total number of students
- Confirmed registrations
- Declined registrations  
- Pending responses
- Vaccination completion rates

### Status Management
Visual indicators for different states:
- **Green**: Confirmed/Successful
- **Red**: Declined/Failed
- **Orange**: Pending/Delayed
- **Blue**: General information

### Data Handling
- Robust error handling with user-friendly messages
- Loading states during API calls
- Empty state handling when no data is available
- Responsive design for different screen sizes

## Usage Examples

### 1. Basic Component Usage
```jsx
import AllStudentsInCampaign from './components/vaccination/AllStudentsInCampaign';
import StudentsWithVaccinationStatus from './components/vaccination/StudentsWithVaccinationStatus';

// Display eligible students
<AllStudentsInCampaign 
  campaignId={123} 
  campaignInfo={campaignInfo}
/>

// Display students with vaccination status
<StudentsWithVaccinationStatus 
  campaignId={123} 
  campaignInfo={campaignInfo}
/>
```

### 2. Service Usage
```javascript
import VaccinationService from '../services/VaccinationService';

// Get eligible students
const eligibleStudents = await VaccinationService.getAllStudentsInCampaign(
  campaignId, 
  { headers: { Authorization: `Bearer ${token}` } }
);

// Get students with status
const studentsWithStatus = await VaccinationService.getStudentsWithVaccinationStatus(
  campaignId, 
  { headers: { Authorization: `Bearer ${token}` } }
);
```

## Testing

### Access the Demo Page
1. Login to the application
2. Navigate to `/demo-vaccination-students`
3. Enter a valid vaccination campaign ID
4. Click "Tìm kiếm" to load campaign information
5. Use the tabs to switch between the two different views

### Expected Data Structure

#### All Students Response
```json
[
  {
    "studentId": 123,
    "fullName": "Nguyễn Văn A",
    "className": "10A1",
    "gender": "Nam",
    "dob": "2008-01-15"
  }
]
```

#### Students with Status Response
```json
[
  {
    "studentId": 123,
    "studentName": "Nguyễn Văn A",
    "className": "10A1",
    "parentConfirmation": true,
    "result": "SUCCESS",
    "vaccinationDate": "2024-01-20",
    "notes": "Tiêm thành công"
  }
]
```

## Integration with Existing System

### VaccinationManagement.jsx
The existing vaccination management page can be enhanced by:
1. Importing the new components
2. Adding them to campaign detail views
3. Using them in expanded row renderers for better student management

### Example Integration
```jsx
// In VaccinationManagement.jsx expanded row
const expandedRowRender = (record) => (
  <div>
    {/* Existing campaign details */}
    
    {/* New student management components */}
    <StudentsWithVaccinationStatus 
      campaignId={record.id} 
      campaignInfo={record}
    />
  </div>
);
```

## Future Enhancements

1. **Export Functionality**: Add Excel/PDF export for student lists
2. **Bulk Operations**: Allow bulk approval/rejection of students
3. **Real-time Updates**: Implement WebSocket for live status updates
4. **Advanced Filters**: Add filtering by class, confirmation status, etc.
5. **Email Notifications**: Integration with notification system for parents

## Dependencies

- React 18+
- Ant Design 5+
- Axios for HTTP requests
- dayjs for date formatting
- React Router for navigation

## Notes

- All components are responsive and mobile-friendly
- Error handling includes both console logging and user notifications
- Loading states prevent multiple simultaneous API calls
- Components are reusable and can be integrated into other pages
- Data validation ensures robust handling of API responses
