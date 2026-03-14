package com.jahfresh.passionprojrest.services;

import com.jahfresh.passionprojrest.models.FoodItem;
import com.jahfresh.passionprojrest.models.FoodStatus;
import com.jahfresh.passionprojrest.repositories.FoodItemRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class FoodItemService {

    @Autowired
    private FoodItemRepo foodItemRepo;

    // Number of days before expiry to mark an item as EXPIRING_SOON
    private static final int EXPIRING_SOON_DAYS = 3;

    public void updateExpiryStatuses() {
        LocalDate today = LocalDate.now();
        LocalDate soonThreshold = today.plusDays(EXPIRING_SOON_DAYS);

        List<FoodItem> items = foodItemRepo.findAll();

        for (FoodItem item : items) {
            // Skip items that have already been consumed or discarded
            if (item.getStatus() == FoodStatus.CONSUMED || item.getStatus() == FoodStatus.DISCARDED) {
                continue;
            }

            if (item.getExpiryDate() == null) {
                continue;
            }

            if (item.getExpiryDate().isBefore(today)) {
                item.setStatus(FoodStatus.EXPIRED);
            } else if (!item.getExpiryDate().isAfter(soonThreshold)) {
                item.setStatus(FoodStatus.EXPIRING_SOON);
            } else {
                item.setStatus(FoodStatus.FRESH);
            }
        }

        foodItemRepo.saveAll(items);
    }
}
