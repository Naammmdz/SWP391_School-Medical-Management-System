package com.school.health.event.usageInventory;

import com.school.health.dto.request.InventoryUsedInMedicalEventRequestDTO;
import com.school.health.dto.request.InventoryUsedRequestDTO;
import com.school.health.entity.InventoryUsedLog;

public class InventoryUsedEvent {

    private InventoryUsedInMedicalEventRequestDTO request;
    private Integer eventID;
    public InventoryUsedEvent(Integer eventID,InventoryUsedInMedicalEventRequestDTO  request) {
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
