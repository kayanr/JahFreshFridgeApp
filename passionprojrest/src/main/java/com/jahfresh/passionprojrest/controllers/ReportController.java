package com.jahfresh.passionprojrest.controllers;

import com.jahfresh.passionprojrest.models.CategorySummaryItem;
import com.jahfresh.passionprojrest.models.ExpirationSummaryReport;
import com.jahfresh.passionprojrest.models.FoodItem;
import com.jahfresh.passionprojrest.models.FoodStatus;
import com.jahfresh.passionprojrest.models.WasteSummaryReport;
import com.jahfresh.passionprojrest.repositories.FoodItemRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    @Autowired
    private FoodItemRepo foodItemRepo;

    @GetMapping("/expiration-summary")
    public ExpirationSummaryReport getExpirationSummary() {
        long freshCount = foodItemRepo.countByStatus(FoodStatus.FRESH);
        long expiringSoonCount = foodItemRepo.countByStatus(FoodStatus.EXPIRING_SOON);
        long expiredCount = foodItemRepo.countByStatus(FoodStatus.EXPIRED);
        long totalActive = freshCount + expiringSoonCount + expiredCount;

        List<FoodItem> itemsRequiringAttention = foodItemRepo.findItemsRequiringAttention();

        return new ExpirationSummaryReport(totalActive, freshCount, expiringSoonCount, expiredCount, itemsRequiringAttention);
    }

    @GetMapping("/waste-summary")
    public WasteSummaryReport getWasteSummary() {
        long consumedCount = foodItemRepo.countByStatus(FoodStatus.CONSUMED);
        long discardedCount = foodItemRepo.countByStatus(FoodStatus.DISCARDED);
        String mostWastedCategory = foodItemRepo.findMostWastedCategory().orElse(null);

        return new WasteSummaryReport(consumedCount, discardedCount, mostWastedCategory);
    }

    @GetMapping("/category-summary")
    public List<CategorySummaryItem> getCategorySummary() {
        List<FoodStatus> excluded = List.of(FoodStatus.CONSUMED, FoodStatus.DISCARDED);
        return foodItemRepo.findCategorySummary(excluded);
    }
}
