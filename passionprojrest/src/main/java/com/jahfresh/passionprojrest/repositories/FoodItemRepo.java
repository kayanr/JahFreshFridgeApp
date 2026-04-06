package com.jahfresh.passionprojrest.repositories;

import com.jahfresh.passionprojrest.models.FoodItem;
import com.jahfresh.passionprojrest.models.FoodStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.jahfresh.passionprojrest.models.CategorySummaryItem;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface FoodItemRepo extends JpaRepository<FoodItem, Long> {

    FoodItem findFoodItemById(Long id);

    // Paginated list scoped to a user
    Page<FoodItem> findByUser_Username(String username, Pageable pageable);

    // Count by status scoped to a user
    long countByStatusAndUser_Username(FoodStatus status, String username);

    // Expiring soon scoped to a user
    @Query("SELECT f FROM FoodItem f WHERE f.user.username = :username " +
            "AND f.expiryDate BETWEEN :today AND :cutoff AND f.status NOT IN :excluded")
    List<FoodItem> findExpiringSoon(
            @Param("username") String username,
            @Param("today") LocalDate today,
            @Param("cutoff") LocalDate cutoff,
            @Param("excluded") List<FoodStatus> excluded
    );

    // Top items requiring attention scoped to a user
    @Query(value = "SELECT * FROM food_items WHERE status NOT IN ('CONSUMED', 'DISCARDED') " +
            "AND user_id = (SELECT id FROM users WHERE username = :username) " +
            "ORDER BY CASE status WHEN 'EXPIRED' THEN 0 WHEN 'EXPIRING_SOON' THEN 1 ELSE 2 END, " +
            "ABS(DATEDIFF(expiry_date, CURRENT_DATE)) ASC",
            nativeQuery = true)
    List<FoodItem> findItemsRequiringAttention(@Param("username") String username);

    // Most wasted category scoped to a user
    @Query(value = "SELECT category FROM food_items WHERE status = 'DISCARDED' " +
            "AND category IS NOT NULL " +
            "AND user_id = (SELECT id FROM users WHERE username = :username) " +
            "GROUP BY category ORDER BY COUNT(*) DESC LIMIT 1",
            nativeQuery = true)
    Optional<String> findMostWastedCategory(@Param("username") String username);

    // Count discarded by category scoped to a user
    @Query(value = "SELECT COUNT(*) FROM food_items WHERE status = 'DISCARDED' " +
            "AND category = :category " +
            "AND user_id = (SELECT id FROM users WHERE username = :username)",
            nativeQuery = true)
    long countDiscardedByCategory(@Param("category") String category, @Param("username") String username);

    // Monthly counts scoped to a user
    @Query(value = "SELECT COUNT(*) FROM food_items WHERE status = 'DISCARDED' " +
            "AND MONTH(updated_date) = :month AND YEAR(updated_date) = :year " +
            "AND user_id = (SELECT id FROM users WHERE username = :username)",
            nativeQuery = true)
    long countDiscardedInMonth(@Param("month") int month, @Param("year") int year, @Param("username") String username);

    @Query(value = "SELECT COUNT(*) FROM food_items " +
            "WHERE MONTH(created_date) = :month AND YEAR(created_date) = :year " +
            "AND user_id = (SELECT id FROM users WHERE username = :username)",
            nativeQuery = true)
    long countItemsAddedInMonth(@Param("month") int month, @Param("year") int year, @Param("username") String username);

    @Query(value = "SELECT COUNT(*) FROM food_items WHERE status = 'CONSUMED' " +
            "AND MONTH(updated_date) = :month AND YEAR(updated_date) = :year " +
            "AND user_id = (SELECT id FROM users WHERE username = :username)",
            nativeQuery = true)
    long countItemsConsumedInMonth(@Param("month") int month, @Param("year") int year, @Param("username") String username);

    @Query(value = "SELECT COUNT(*) FROM food_items WHERE status = 'EXPIRED' " +
            "AND MONTH(expiry_date) = :month AND YEAR(expiry_date) = :year " +
            "AND user_id = (SELECT id FROM users WHERE username = :username)",
            nativeQuery = true)
    long countItemsExpiredInMonth(@Param("month") int month, @Param("year") int year, @Param("username") String username);

    // Category summary scoped to a user
    @Query("SELECT new com.jahfresh.passionprojrest.models.CategorySummaryItem(f.category, COUNT(f), " +
            "SUM(CASE WHEN f.status = com.jahfresh.passionprojrest.models.FoodStatus.FRESH THEN 1L ELSE 0L END), " +
            "SUM(CASE WHEN f.status = com.jahfresh.passionprojrest.models.FoodStatus.EXPIRING_SOON THEN 1L ELSE 0L END), " +
            "SUM(CASE WHEN f.status = com.jahfresh.passionprojrest.models.FoodStatus.EXPIRED THEN 1L ELSE 0L END)) " +
            "FROM FoodItem f WHERE f.user.username = :username " +
            "AND f.status NOT IN :excluded AND f.category IS NOT NULL GROUP BY f.category ORDER BY f.category")
    List<CategorySummaryItem> findCategorySummary(@Param("username") String username, @Param("excluded") List<FoodStatus> excluded);
}
