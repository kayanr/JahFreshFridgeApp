package com.jahfresh.passionprojrest.models;

public enum FoodStatus {
    FRESH("Fresh, good to use"),
    EXPIRING_SOON("Expiring soon, use quickly"),
    EXPIRED("Expired, discard"),
    CONSUMED("Consumed by user"),
    DISCARDED("Discarded by user");

    private final String description;

    FoodStatus(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
