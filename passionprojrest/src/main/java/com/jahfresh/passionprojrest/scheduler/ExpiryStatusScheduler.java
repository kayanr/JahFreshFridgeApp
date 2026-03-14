package com.jahfresh.passionprojrest.scheduler;

import com.jahfresh.passionprojrest.services.FoodItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class ExpiryStatusScheduler {

    @Autowired
    private FoodItemService foodItemService;

    // Runs every day at midnight
    @Scheduled(cron = "0 0 0 * * *")
    public void updateExpiryStatuses() {
        foodItemService.updateExpiryStatuses();
    }
}
