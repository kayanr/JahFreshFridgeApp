package com.jahfresh.passionprojrest.repositories;

import com.jahfresh.passionprojrest.models.FoodItem;
import com.jahfresh.passionprojrest.models.FoodStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Pageable;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

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

    @Query(value = "SELECT * FROM food_items WHERE status NOT IN ('CONSUMED', 'DISCARDED') " +
            "ORDER BY CASE status WHEN 'EXPIRED' THEN 0 WHEN 'EXPIRING_SOON' THEN 1 ELSE 2 END, expiry_date ASC LIMIT 5",
            nativeQuery = true)
    List<FoodItem> findItemsRequiringAttention();

    @Query(value = "SELECT category FROM food_items WHERE status = 'DISCARDED' AND category IS NOT NULL " +
            "GROUP BY category ORDER BY COUNT(*) DESC LIMIT 1",
            nativeQuery = true)
    Optional<String> findMostWastedCategory();
}
