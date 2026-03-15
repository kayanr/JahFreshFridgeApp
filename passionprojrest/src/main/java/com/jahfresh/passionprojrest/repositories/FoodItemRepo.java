package com.jahfresh.passionprojrest.repositories;

import com.jahfresh.passionprojrest.models.FoodItem;
import com.jahfresh.passionprojrest.models.FoodStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface FoodItemRepo extends JpaRepository<FoodItem, Long> {
    FoodItem findFoodItemById(Long id);
    List<FoodItem> findAll();
    long countByStatus(FoodStatus status);

    @Query("SELECT f FROM FoodItem f WHERE f.expiryDate BETWEEN :today AND :cutoff AND f.status NOT IN :excluded")
    List<FoodItem> findExpiringSoon(
        @Param("today") LocalDate today,
        @Param("cutoff") LocalDate cutoff,
        @Param("excluded") List<FoodStatus> excluded
    );
}
