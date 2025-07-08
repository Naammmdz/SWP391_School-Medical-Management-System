package com.school.health.event.usageInventory;

import com.school.health.dto.request.InventoryUsedInMedicalEventRequestDTO;

public class InventoryUsedUpdateEvent {

    private InventoryUsedInMedicalEventRequestDTO request;
    private Integer eventID;
    public InventoryUsedUpdateEvent(Integer eventID, InventoryUsedInMedicalEventRequestDTO  request) {
        this.request = request;
    this.eventID = eventID;
    }
    public InventoryUsedInMedicalEventRequestDTO getRequest() {
        return request;
    }
    public Integer getEventID() {
        return eventID;
    }
}
