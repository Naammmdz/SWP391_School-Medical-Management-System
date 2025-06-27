package com.school.health.event;

import com.school.health.entity.Inventory;

import java.util.List;

public class ExpiredInventoryEvent {
    private final List<Inventory> expiredInventories;
    public ExpiredInventoryEvent(List<Inventory> expiredInventories) {
        this.expiredInventories = expiredInventories;
    }
    public List<Inventory> getExpiredInventories() {
        return expiredInventories;
    }
}
