package com.jahfresh.passionprojrest.Repo;

import com.jahfresh.passionprojrest.Models.FoodItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

public interface FoodItemRepo extends JpaRepository<FoodItem, Long> {
}
