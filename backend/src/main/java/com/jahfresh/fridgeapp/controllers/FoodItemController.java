package com.jahfresh.fridgeapp.controllers;

import com.jahfresh.fridgeapp.models.FoodCategory;
import com.jahfresh.fridgeapp.models.FoodItem;
import com.jahfresh.fridgeapp.models.FoodItemDto;
import com.jahfresh.fridgeapp.models.FoodStatus;
import com.jahfresh.fridgeapp.repositories.FoodItemRepo;
import com.jahfresh.fridgeapp.services.FoodItemService;
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

    @GetMapping
    public Page<FoodItem> getFoodItems(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        return foodItemRepo.findAll(pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FoodItem> getFoodItem(@PathVariable Long id) {
        FoodItem foodItem = foodItemRepo.findById(id).orElse(null);
        if (foodItem == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(foodItem);
    }

    @PostMapping
    public ResponseEntity<FoodItem> createFoodItem(@Valid @RequestBody FoodItemDto foodItemDto) {
        FoodItem foodItem = new FoodItem();
        foodItem.setName(foodItemDto.getName());
        foodItem.setNotes(foodItemDto.getNotes());
        foodItem.setExpiryDate(foodItemDto.getExpiryDate());
        foodItem.setQuantity(foodItemDto.getQuantity());
        foodItem.setStatus(foodItemDto.getStatus());
        foodItem.setCategory(foodItemDto.getCategory());
        foodItem.setCreatedDate(new Date());
        foodItemRepo.save(foodItem);
        return ResponseEntity.status(HttpStatus.CREATED).body(foodItem);
    }

    @PutMapping("/{id}")
    public ResponseEntity<FoodItem> updateFoodItem(@PathVariable Long id, @Valid @RequestBody FoodItemDto foodItemDto) {
        FoodItem foodItem = foodItemRepo.findById(id).orElse(null);
        if (foodItem == null) {
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
        FoodItem foodItem = foodItemRepo.findById(id).orElse(null);
        if (foodItem == null) {
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
        LocalDate today = LocalDate.now();
        LocalDate cutoff = today.plusDays(3);
        List<FoodStatus> excluded = Arrays.asList(FoodStatus.CONSUMED, FoodStatus.DISCARDED, FoodStatus.EXPIRED);
        return foodItemRepo.findExpiringSoon(today, cutoff, excluded);
    }

    @GetMapping("/categories")
    public FoodCategory[] getCategories() {
        return FoodCategory.values();
    }

    @GetMapping("/stats")
    public Map<String, Long> getStats() {
        Map<String, Long> stats = new LinkedHashMap<>();
        long total = 0;
        for (FoodStatus status : FoodStatus.values()) {
            long count = foodItemRepo.countByStatus(status);
            stats.put(status.name(), count);
            total += count;
        }
        stats.put("total", total);
        return stats;
    }
}
