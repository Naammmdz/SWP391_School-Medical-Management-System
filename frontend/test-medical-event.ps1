# Test script for Medical Event Creation API
# This script demonstrates how to call the medical event creation endpoint

# API Configuration
$baseUrl = "http://localhost:8080"
$endpoint = "$baseUrl/api/nurse/medical-events"

# You need to replace this with a valid JWT token
# You can get this from the browser's localStorage after logging in as a nurse
$token = "YOUR_JWT_TOKEN_HERE"

# Sample request payload
$requestBody = @{
    title = "Test Medical Event"
    stuId = @(1, 2)  # Replace with actual student IDs
    eventType = "INJURY"
    eventDate = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss")
    location = "Playground"
    description = "Student fell during recess"
    relatedItemUsed = @(
        @{
            itemId = 1  # Replace with actual inventory item ID
            quantityUsed = 2
            notes = "Applied bandage to wound"
        }
    )
    notes = "Student is stable, parents notified"
    handlingMeasures = "First aid applied, wound cleaned and bandaged"
    severityLevel = "MINOR"
    status = "PROCESSING"
} | ConvertTo-Json -Depth 3

# Headers
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

Write-Host "Testing Medical Event Creation API..." -ForegroundColor Green
Write-Host "Endpoint: $endpoint" -ForegroundColor Yellow
Write-Host "Request Body:" -ForegroundColor Yellow
Write-Host $requestBody -ForegroundColor Cyan

try {
    # Make the API call
    $response = Invoke-RestMethod -Uri $endpoint -Method POST -Headers $headers -Body $requestBody
    
    Write-Host "Success! Response:" -ForegroundColor Green
    Write-Host ($response | ConvertTo-Json -Depth 3) -ForegroundColor Cyan
    
} catch {
    Write-Host "Error occurred:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "Status Code: $statusCode" -ForegroundColor Red
        
        if ($statusCode -eq 403) {
            Write-Host "Authentication failed. Please ensure you have a valid JWT token." -ForegroundColor Yellow
        } elseif ($statusCode -eq 400) {
            Write-Host "Bad request. Please check your request payload." -ForegroundColor Yellow
        }
    }
}

Write-Host ""
Write-Host "To get a valid JWT token:" -ForegroundColor Yellow
Write-Host "1. Start the frontend application (npm run dev)" -ForegroundColor White
Write-Host "2. Login as a nurse user" -ForegroundColor White  
Write-Host "3. Open browser developer tools (F12)" -ForegroundColor White
Write-Host "4. Go to Application -> Local Storage -> http://localhost:3000" -ForegroundColor White
Write-Host "5. Copy the 'token' value" -ForegroundColor White
Write-Host "6. Replace 'YOUR_JWT_TOKEN_HERE' in this script with the actual token" -ForegroundColor White
