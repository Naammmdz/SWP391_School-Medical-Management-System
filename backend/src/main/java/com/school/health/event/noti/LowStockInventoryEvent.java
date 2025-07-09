package com.school.health.event.noti;

import com.school.health.entity.Inventory;

public class LowStockInventoryEvent {
    private final Inventory inventory;
    public LowStockInventoryEvent(Inventory inventory) {
        this.inventory = inventory;
    }
    public Inventory getInventory() {
        return inventory;
    }
}
