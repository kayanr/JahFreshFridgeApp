package com.jahfresh.passionprojrest.models;


import org.springframework.format.annotation.DateTimeFormat;
import java.time.LocalDate;
import java.util.Date;

public class FoodItemDto {

    private String name;
    private String description;
    @DateTimeFormat(pattern = "MM/dd/yyyy")
    private LocalDate expiryDate;
    private Date createdDate;
    private Date updatedDate;
    private int quantity;
    private FoodStatus status;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(LocalDate expiryDate) {
        this.expiryDate = expiryDate;
    }

    public Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Date createdDate) {
        this.createdDate = createdDate;
    }
    public Date getUpdatedDate() {
        return updatedDate;
    }

    public void setUpdatedDate(Date updatedDate) {
        this.updatedDate = updatedDate;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public FoodStatus getStatus() { return status; }

    public void setStatus(FoodStatus status) { this.status = status; }
}
