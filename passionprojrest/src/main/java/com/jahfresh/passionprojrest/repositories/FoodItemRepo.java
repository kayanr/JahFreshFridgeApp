package com.jahfresh.passionprojrest.repositories;

import com.jahfresh.passionprojrest.models.FoodItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FoodItemRepo extends JpaRepository<FoodItem, Long> {
    FoodItem findFoodItemById(Long id);
    List<FoodItem> findAll();
}
