package com.jahfresh.passionprojrest.models;

import java.util.List;

public class ExpirationSummaryReport {

    private long totalActive;
    private long freshCount;
    private long expiringSoonCount;
    private long expiredCount;
    private List<FoodItem> topExpiringItems;

    public ExpirationSummaryReport(long totalActive, long freshCount, long expiringSoonCount,
                                    long expiredCount, List<FoodItem> topExpiringItems) {
        this.totalActive = totalActive;
        this.freshCount = freshCount;
        this.expiringSoonCount = expiringSoonCount;
        this.expiredCount = expiredCount;
        this.topExpiringItems = topExpiringItems;
    }

    public long getTotalActive() { return totalActive; }
    public long getFreshCount() { return freshCount; }
    public long getExpiringSoonCount() { return expiringSoonCount; }
    public long getExpiredCount() { return expiredCount; }
    public List<FoodItem> getTopExpiringItems() { return topExpiringItems; }
}
