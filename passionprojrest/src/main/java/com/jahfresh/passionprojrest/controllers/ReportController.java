package com.jahfresh.passionprojrest.controllers;

import com.jahfresh.passionprojrest.models.CategorySummaryItem;
import com.jahfresh.passionprojrest.models.ExpirationSummaryReport;
import com.jahfresh.passionprojrest.models.FoodItem;
import com.jahfresh.passionprojrest.models.FoodStatus;
import com.jahfresh.passionprojrest.models.MonthlyActivityReport;
import com.jahfresh.passionprojrest.models.WasteSummaryReport;
import com.jahfresh.passionprojrest.repositories.FoodItemRepo;
import com.jahfresh.passionprojrest.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    @Autowired
    private FoodItemRepo foodItemRepo;

    @Autowired
    private UserService userService;

    @GetMapping("/expiration-summary")
    public ExpirationSummaryReport getExpirationSummary() {
        String username = userService.getCurrentUsername();

        long freshCount = foodItemRepo.countByStatusAndUser_Username(FoodStatus.FRESH, username);
        long expiringSoonCount = foodItemRepo.countByStatusAndUser_Username(FoodStatus.EXPIRING_SOON, username);
        long expiredCount = foodItemRepo.countByStatusAndUser_Username(FoodStatus.EXPIRED, username);
        long totalActive = freshCount + expiringSoonCount + expiredCount;

        List<FoodItem> itemsRequiringAttention = foodItemRepo.findItemsRequiringAttention(username);

        return new ExpirationSummaryReport(totalActive, freshCount, expiringSoonCount, expiredCount, itemsRequiringAttention);
    }

    @GetMapping("/waste-summary")
    public WasteSummaryReport getWasteSummary() {
        String username = userService.getCurrentUsername();

        long consumedCount = foodItemRepo.countByStatusAndUser_Username(FoodStatus.CONSUMED, username);
        long discardedCount = foodItemRepo.countByStatusAndUser_Username(FoodStatus.DISCARDED, username);
        String mostWastedCategory = foodItemRepo.findMostWastedCategory(username).orElse(null);
        long mostWastedCategoryCount = mostWastedCategory != null
                ? foodItemRepo.countDiscardedByCategory(mostWastedCategory, username)
                : 0;

        LocalDate now = LocalDate.now();
        LocalDate lastMonth = now.minusMonths(1);
        long lastMonthConsumed = foodItemRepo.countItemsConsumedInMonth(lastMonth.getMonthValue(), lastMonth.getYear(), username);
        long lastMonthDiscarded = foodItemRepo.countDiscardedInMonth(lastMonth.getMonthValue(), lastMonth.getYear(), username);
        long lastMonthTotal = lastMonthConsumed + lastMonthDiscarded;

        long thisMonthConsumed = foodItemRepo.countItemsConsumedInMonth(now.getMonthValue(), now.getYear(), username);
        long thisMonthDiscarded = foodItemRepo.countDiscardedInMonth(now.getMonthValue(), now.getYear(), username);
        long thisMonthTotal = thisMonthConsumed + thisMonthDiscarded;

        Double wasteRateTrend = null;
        if (lastMonthTotal > 0 && thisMonthTotal > 0) {
            double lastRate = Math.round((lastMonthDiscarded * 100.0 / lastMonthTotal) * 10) / 10.0;
            double thisRate = Math.round((thisMonthDiscarded * 100.0 / thisMonthTotal) * 10) / 10.0;
            wasteRateTrend = Math.round((thisRate - lastRate) * 10) / 10.0;
        }

        return new WasteSummaryReport(consumedCount, discardedCount, mostWastedCategory, mostWastedCategoryCount, wasteRateTrend);
    }

    @GetMapping("/category-summary")
    public List<CategorySummaryItem> getCategorySummary() {
        String username = userService.getCurrentUsername();
        List<FoodStatus> excluded = List.of(FoodStatus.CONSUMED, FoodStatus.DISCARDED);
        return foodItemRepo.findCategorySummary(username, excluded);
    }

    @GetMapping("/monthly-activity")
    public MonthlyActivityReport getMonthlyActivity() {
        String username = userService.getCurrentUsername();
        LocalDate now = LocalDate.now();
        int month = now.getMonthValue();
        int year = now.getYear();

        long itemsAdded = foodItemRepo.countItemsAddedInMonth(month, year, username);
        long itemsConsumed = foodItemRepo.countItemsConsumedInMonth(month, year, username);
        long itemsExpired = foodItemRepo.countItemsExpiredInMonth(month, year, username);

        return new MonthlyActivityReport(itemsAdded, itemsConsumed, itemsExpired, month, year);
    }
}
