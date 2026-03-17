package com.jahfresh.passionprojrest.models;

public class MonthlyActivityReport {

    private long itemsAdded;
    private long itemsConsumed;
    private long itemsExpired;
    private int month;
    private int year;

    public MonthlyActivityReport(long itemsAdded, long itemsConsumed, long itemsExpired, int month, int year) {
        this.itemsAdded = itemsAdded;
        this.itemsConsumed = itemsConsumed;
        this.itemsExpired = itemsExpired;
        this.month = month;
        this.year = year;
    }

    public long getItemsAdded() { return itemsAdded; }
    public long getItemsConsumed() { return itemsConsumed; }
    public long getItemsExpired() { return itemsExpired; }
    public int getMonth() { return month; }
    public int getYear() { return year; }
}
