package com.jahfresh.passionprojrest.controllers;

import com.jahfresh.passionprojrest.models.FoodCategory;
import com.jahfresh.passionprojrest.models.FoodItem;
import com.jahfresh.passionprojrest.models.FoodItemDto;
import com.jahfresh.passionprojrest.models.FoodStatus;
import com.jahfresh.passionprojrest.models.User;
import com.jahfresh.passionprojrest.repositories.FoodItemRepo;
import com.jahfresh.passionprojrest.repositories.UserRepo;
import com.jahfresh.passionprojrest.services.FoodItemService;
import com.jahfresh.passionprojrest.services.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/fooditems")
public class FoodItemController {

    @Autowired
    private FoodItemRepo foodItemRepo;

    @Autowired
    private FoodItemService foodItemService;

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepo userRepo;

    @GetMapping
    public Page<FoodItem> getFoodItems(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        String username = userService.getCurrentUsername();
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        return foodItemRepo.findByUser_Username(username, pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FoodItem> getFoodItem(@PathVariable Long id) {
        String username = userService.getCurrentUsername();
        FoodItem foodItem = foodItemRepo.findById(id).orElse(null);
        if (foodItem == null || !foodItem.getUser().getUsername().equals(username)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(foodItem);
    }

    @PostMapping
    public ResponseEntity<FoodItem> createFoodItem(@Valid @RequestBody FoodItemDto foodItemDto) {
        String username = userService.getCurrentUsername();
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        FoodItem foodItem = new FoodItem();
        foodItem.setName(foodItemDto.getName());
        foodItem.setNotes(foodItemDto.getNotes());
        foodItem.setExpiryDate(foodItemDto.getExpiryDate());
        foodItem.setQuantity(foodItemDto.getQuantity());
        foodItem.setStatus(foodItemDto.getStatus());
        foodItem.setCategory(foodItemDto.getCategory());
        foodItem.setCreatedDate(new Date());
        foodItem.setUser(user);
        foodItemRepo.save(foodItem);
        return ResponseEntity.status(HttpStatus.CREATED).body(foodItem);
    }

    @PutMapping("/{id}")
    public ResponseEntity<FoodItem> updateFoodItem(@PathVariable Long id, @Valid @RequestBody FoodItemDto foodItemDto) {
        String username = userService.getCurrentUsername();
        FoodItem foodItem = foodItemRepo.findById(id).orElse(null);
        if (foodItem == null || !foodItem.getUser().getUsername().equals(username)) {
            return ResponseEntity.notFound().build();
        }
        foodItem.setName(foodItemDto.getName());
        foodItem.setNotes(foodItemDto.getNotes());
        foodItem.setExpiryDate(foodItemDto.getExpiryDate());
        foodItem.setQuantity(foodItemDto.getQuantity());
        foodItem.setStatus(foodItemDto.getStatus());
        foodItem.setCategory(foodItemDto.getCategory());
        foodItem.setUpdatedDate(new Date());
        foodItemRepo.save(foodItem);
        return ResponseEntity.ok(foodItem);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFoodItem(@PathVariable Long id) {
        String username = userService.getCurrentUsername();
        FoodItem foodItem = foodItemRepo.findById(id).orElse(null);
        if (foodItem == null || !foodItem.getUser().getUsername().equals(username)) {
            return ResponseEntity.notFound().build();
        }
        foodItemRepo.delete(foodItem);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/refresh-statuses")
    public ResponseEntity<Void> refreshStatuses() {
        foodItemService.updateExpiryStatuses();
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/expiring-soon")
    public List<FoodItem> getExpiringSoon() {
        String username = userService.getCurrentUsername();
        LocalDate today = LocalDate.now();
        LocalDate cutoff = today.plusDays(3);
        List<FoodStatus> excluded = Arrays.asList(FoodStatus.CONSUMED, FoodStatus.DISCARDED, FoodStatus.EXPIRED);
        return foodItemRepo.findExpiringSoon(username, today, cutoff, excluded);
    }

    @GetMapping("/categories")
    public FoodCategory[] getCategories() {
        return FoodCategory.values();
    }

    @GetMapping("/stats")
    public Map<String, Long> getStats() {
        String username = userService.getCurrentUsername();
        Map<String, Long> stats = new LinkedHashMap<>();
        long total = 0;
        for (FoodStatus status : FoodStatus.values()) {
            long count = foodItemRepo.countByStatusAndUser_Username(status, username);
            stats.put(status.name(), count);
            total += count;
        }
        stats.put("total", total);
        return stats;
    }
}
