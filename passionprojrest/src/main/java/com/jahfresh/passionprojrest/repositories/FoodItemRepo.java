package com.jahfresh.passionprojrest.repositories;

import com.jahfresh.passionprojrest.models.FoodItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FoodItemRepo extends JpaRepository<FoodItem, Long> {
}
