package com.school.health.event.usageInventory;

import com.school.health.dto.request.InventoryUsedInMedicalEventRequestDTO;
import com.school.health.dto.request.InventoryUsedInMedicalEventUpdateRequestDTO;

public class InventoryUsedUpdateEvent {

    private InventoryUsedInMedicalEventUpdateRequestDTO request;
    private Integer eventID;
    public InventoryUsedUpdateEvent(Integer eventID, InventoryUsedInMedicalEventUpdateRequestDTO request) {
        this.request = request;
    this.eventID = eventID;
    }
    public InventoryUsedInMedicalEventUpdateRequestDTO getRequest() {
        return request;
    }
    public Integer getEventID() {
        return eventID;
    }
}
