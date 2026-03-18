package com.jahfresh.passionprojrest.models;

public class WasteSummaryReport {

    private long consumedCount;
    private long discardedCount;
    private long totalProcessed;
    private double wasteRate;
    private String mostWastedCategory;
    private long mostWastedCategoryCount;
    private Double wasteRateTrend;

    public WasteSummaryReport(long consumedCount, long discardedCount, String mostWastedCategory,
                               long mostWastedCategoryCount, Double wasteRateTrend) {
        this.consumedCount = consumedCount;
        this.discardedCount = discardedCount;
        this.totalProcessed = consumedCount + discardedCount;
        this.wasteRate = totalProcessed > 0
                ? Math.round((discardedCount * 100.0 / totalProcessed) * 10) / 10.0
                : 0.0;
        this.mostWastedCategory = mostWastedCategory;
        this.mostWastedCategoryCount = mostWastedCategoryCount;
        this.wasteRateTrend = wasteRateTrend;
    }

    public long getConsumedCount() { return consumedCount; }
    public long getDiscardedCount() { return discardedCount; }
    public long getTotalProcessed() { return totalProcessed; }
    public double getWasteRate() { return wasteRate; }
    public String getMostWastedCategory() { return mostWastedCategory; }
    public long getMostWastedCategoryCount() { return mostWastedCategoryCount; }
    public Double getWasteRateTrend() { return wasteRateTrend; }
}
