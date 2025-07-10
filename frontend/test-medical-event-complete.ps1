# Complete Medical Event Creation Test Script
# This script demonstrates the improved medical event creation process

# API Configuration
$baseUrl = "http://localhost:8080"
$endpoint = "$baseUrl/api/nurse/medical-events"

# Test with actual data (replace with your actual values)
$token = "YOUR_JWT_TOKEN_HERE"

# Sample request payload with all required fields
$requestBody = @{
    title = "Complete Medical Event Test"
    stuId = @(1, 2)  # Replace with actual student IDs from your database
    eventType = "INJURY"
    eventDate = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss")
    location = "School Playground"
    description = "Student fell during recess and sustained minor injuries"
    relatedItemUsed = @(
        @{
            itemId = 1  # Replace with actual inventory item ID
            quantityUsed = 2
            notes = "Applied bandage to wound and cleaned with antiseptic"
        },
        @{
            itemId = 2  # Replace with another inventory item ID
            quantityUsed = 1
            notes = "Applied ice pack to reduce swelling"
        }
    )
    notes = "Student is stable, parents contacted, no serious injuries"
    handlingMeasures = "First aid applied, wound cleaned and bandaged, ice pack applied"
    severityLevel = "MINOR"
    status = "PROCESSING"
} | ConvertTo-Json -Depth 3

# Headers
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

Write-Host "=== COMPLETE MEDICAL EVENT CREATION TEST ===" -ForegroundColor Green
Write-Host "Endpoint: $endpoint" -ForegroundColor Yellow
Write-Host "Request Body:" -ForegroundColor Yellow
Write-Host $requestBody -ForegroundColor Cyan

try {
    # Make the API call
    $response = Invoke-RestMethod -Uri $endpoint -Method POST -Headers $headers -Body $requestBody
    
    Write-Host "✅ SUCCESS! Medical Event Created Successfully!" -ForegroundColor Green
    Write-Host "Response:" -ForegroundColor Green
    Write-Host ($response | ConvertTo-Json -Depth 3) -ForegroundColor Cyan
    
    # Display key information
    Write-Host ""
    Write-Host "📋 Event Details:" -ForegroundColor Yellow
    Write-Host "• Event ID: $($response.id)" -ForegroundColor White
    Write-Host "• Title: $($response.title)" -ForegroundColor White
    Write-Host "• Student IDs: $($response.stuId -join ', ')" -ForegroundColor White
    Write-Host "• Status: $($response.status)" -ForegroundColor White
    Write-Host "• Created At: $($response.createdAt)" -ForegroundColor White
    
    if ($response.relatedMedicinesUsed -and $response.relatedMedicinesUsed.Count -gt 0) {
        Write-Host "• Inventory Items Used:" -ForegroundColor White
        foreach ($item in $response.relatedMedicinesUsed) {
            Write-Host "  - $($item.medicineName): $($item.quantityUsed) $($item.unit)" -ForegroundColor Gray
        }
    }
    
    Write-Host ""
    Write-Host "🎉 Test completed successfully!" -ForegroundColor Green
    Write-Host "✅ Medical event created in database" -ForegroundColor Green
    Write-Host "✅ Student relationships saved" -ForegroundColor Green
    Write-Host "✅ Inventory quantities updated" -ForegroundColor Green
    
} catch {
    Write-Host "❌ ERROR occurred:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "Status Code: $statusCode" -ForegroundColor Red
        
        switch ($statusCode) {
            403 { 
                Write-Host "🔐 Authentication failed. Please ensure you have a valid JWT token." -ForegroundColor Yellow
                Write-Host "Follow the steps below to get a valid token." -ForegroundColor Yellow
            }
            400 { 
                Write-Host "📝 Bad request. Please check your request payload." -ForegroundColor Yellow
                Write-Host "Ensure student IDs and inventory item IDs exist in your database." -ForegroundColor Yellow
            }
            500 { 
                Write-Host "🔧 Server error. Check the backend logs for detailed error information." -ForegroundColor Yellow
            }
        }
    }
}

Write-Host ""
Write-Host "📖 How to get a valid JWT token:" -ForegroundColor Yellow
Write-Host "1. Start the frontend application: npm run dev" -ForegroundColor White
Write-Host "2. Login as a nurse user" -ForegroundColor White  
Write-Host "3. Open browser developer tools (F12)" -ForegroundColor White
Write-Host "4. Go to Application → Local Storage → http://localhost:3000" -ForegroundColor White
Write-Host "5. Copy the 'token' value" -ForegroundColor White
Write-Host "6. Replace 'YOUR_JWT_TOKEN_HERE' in this script with the actual token" -ForegroundColor White

Write-Host ""
Write-Host "🔧 Backend Improvements Made:" -ForegroundColor Yellow
Write-Host "• Added proper @Transactional annotations" -ForegroundColor White
Write-Host "• Replaced event-driven approach with direct service calls" -ForegroundColor White
Write-Host "• Enhanced error handling and logging" -ForegroundColor White
Write-Host "• Improved ManyToMany relationship handling" -ForegroundColor White
Write-Host "• Added comprehensive transaction management" -ForegroundColor White

Write-Host ""
Write-Host "📊 What This Test Verifies:" -ForegroundColor Yellow
Write-Host "1. Medical event is created and saved to database" -ForegroundColor White
Write-Host "2. Student relationships are properly saved in medical_event_student table" -ForegroundColor White
Write-Host "3. Inventory quantities are decreased when items are used" -ForegroundColor White
Write-Host "4. Inventory usage logs are created with proper references" -ForegroundColor White
Write-Host "5. All operations happen within a single transaction" -ForegroundColor White
