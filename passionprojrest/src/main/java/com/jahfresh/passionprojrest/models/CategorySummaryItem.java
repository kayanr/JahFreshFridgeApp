package com.jahfresh.passionprojrest.models;

public class CategorySummaryItem {

    private String category;
    private long total;
    private long freshCount;
    private long expiringSoonCount;
    private long expiredCount;

    public CategorySummaryItem(FoodCategory category, long total, long freshCount,
                                long expiringSoonCount, long expiredCount) {
        this.category = category != null ? category.name() : "UNCATEGORISED";
        this.total = total;
        this.freshCount = freshCount;
        this.expiringSoonCount = expiringSoonCount;
        this.expiredCount = expiredCount;
    }

    public String getCategory() { return category; }
    public long getTotal() { return total; }
    public long getFreshCount() { return freshCount; }
    public long getExpiringSoonCount() { return expiringSoonCount; }
    public long getExpiredCount() { return expiredCount; }
}
