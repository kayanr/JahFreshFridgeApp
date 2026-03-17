package com.jahfresh.fridgeapp.models;


import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class FoodItemDto {

    @NotBlank(message = "Name is required")
    private String name;

    private String notes;

    @NotNull(message = "Expiry date is required")
    private LocalDate expiryDate;

    @Min(value = 1, message = "Quantity must be at least 1")
    private int quantity;

    @NotNull(message = "Status is required")
    private FoodStatus status;

    @NotNull(message = "Category is required")
    private FoodCategory category;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public LocalDate getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(LocalDate expiryDate) {
        this.expiryDate = expiryDate;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public FoodStatus getStatus() { return status; }

    public void setStatus(FoodStatus status) { this.status = status; }

    public FoodCategory getCategory() { return category; }

    public void setCategory(FoodCategory category) { this.category = category; }
}
