# Medical Event Creation API Test Instructions

## Endpoint Details
- **URL**: `POST http://localhost:8080/api/nurse/medical-events`
- **Authentication**: Bearer token required (NURSE role)
- **Content-Type**: application/json

## Request Format

### Required Headers
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

### Request Body Structure
```json
{
  "title": "String (required)",
  "stuId": [1, 2, 3],
  "eventType": "String",
  "eventDate": "2025-07-09T17:20:09",
  "location": "String",
  "description": "String",
  "relatedItemUsed": [
    {
      "itemId": 1,
      "quantityUsed": 2,
      "notes": "String (optional)"
    }
  ],
  "notes": "String",
  "handlingMeasures": "String",
  "severityLevel": "MINOR|MODERATE|MAJOR|CRITICAL",
  "status": "PROCESSING|RESOLVED"
}
```

## How to Test

### Option 1: Using PowerShell Script
1. Run the provided `test-medical-event.ps1` script
2. Replace `YOUR_JWT_TOKEN_HERE` with a valid token
3. Update student IDs and inventory item IDs with actual values

### Option 2: Using Frontend Application
1. Start the frontend: `npm run dev`
2. Login as a nurse user
3. Navigate to the medical events page
4. Create a new medical event through the UI
5. Check browser network tab for the actual API call

### Option 3: Using Browser Developer Console
1. Login to the frontend as a nurse
2. Open browser developer tools (F12)
3. Go to Console tab
4. Run this JavaScript code:

```javascript
const token = localStorage.getItem('token');
const apiUrl = 'http://localhost:8080/api/nurse/medical-events';

const requestData = {
  title: "Test Medical Event",
  stuId: [1, 2],  // Replace with actual student IDs
  eventType: "INJURY",
  eventDate: new Date().toISOString(),
  location: "Playground",
  description: "Student fell during recess",
  relatedItemUsed: [
    {
      itemId: 1,  // Replace with actual inventory item ID
      quantityUsed: 2,
      notes: "Applied bandage to wound"
    }
  ],
  notes: "Student is stable, parents notified",
  handlingMeasures: "First aid applied, wound cleaned and bandaged",
  severityLevel: "MINOR",
  status: "PROCESSING"
};

fetch(apiUrl, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(requestData)
})
.then(response => response.json())
.then(data => console.log('Success:', data))
.catch(error => console.error('Error:', error));
```

## Getting a Valid JWT Token

1. Start the frontend application: `npm run dev`
2. Login as a nurse user
3. Open browser developer tools (F12)
4. Go to: Application → Local Storage → http://localhost:3000
5. Copy the 'token' value
6. Use this token in the Authorization header

## Expected Response

On success, you should receive a JSON response with the created medical event details including:
- Event ID
- Student information
- Created timestamp
- Status
- Related inventory usage logs

## Common Issues

1. **403 Forbidden**: Invalid or missing JWT token
2. **400 Bad Request**: Invalid request payload or missing required fields
3. **404 Not Found**: Student ID or inventory item ID doesn't exist
4. **500 Internal Server Error**: Server-side error, check backend logs

## Backend Debugging

The updated backend now includes detailed logging. Check the console output for:
- Student addition confirmation
- Inventory item processing
- Transaction success/failure messages
- Any error stack traces
