package com.jahfresh.passionprojrest.controllers;

import com.jahfresh.passionprojrest.models.FoodItem;
import com.jahfresh.passionprojrest.models.FoodItemDto;
import com.jahfresh.passionprojrest.repositories.FoodItemRepo;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/fooditems")
public class FoodItemController {

    @Autowired
    private FoodItemRepo foodItemRepo;

    @GetMapping
    public List<FoodItem> getFoodItems() {
        return foodItemRepo.findAll(Sort.by(Sort.Direction.DESC, "id"));
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
        foodItem.setDescription(foodItemDto.getDescription());
        foodItem.setExpiryDate(foodItemDto.getExpiryDate());
        foodItem.setQuantity(foodItemDto.getQuantity());
        foodItem.setStatus(foodItemDto.getStatus());
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
        foodItem.setDescription(foodItemDto.getDescription());
        foodItem.setExpiryDate(foodItemDto.getExpiryDate());
        foodItem.setQuantity(foodItemDto.getQuantity());
        foodItem.setStatus(foodItemDto.getStatus());
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
}
