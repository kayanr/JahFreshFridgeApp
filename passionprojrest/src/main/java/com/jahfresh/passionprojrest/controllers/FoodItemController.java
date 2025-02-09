package com.jahfresh.passionprojrest.controllers;

import com.jahfresh.passionprojrest.models.FoodItem;
import com.jahfresh.passionprojrest.models.FoodItemDto;
import com.jahfresh.passionprojrest.repositories.FoodItemRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/fooditems")
public class FoodItemController {

    @Autowired
    private FoodItemRepo foodItemRepo;

 /*   @GetMapping(value = "/foo")
    public String getPage(){
        return "index";
    }*/

    @GetMapping({"","/"})
    public String getFoodItems(Model model) {
        var foodItems = foodItemRepo.findAll(Sort.by(Sort.Direction.DESC, "id"));
        model.addAttribute("fooditems", foodItems);
        return "fooditems/index";
    }

       /* @GetMapping("/users")
        public String listUsers(Model model) {
            model.addAttribute("users", userRepo.getAllUsers());
            return "users"; }*/

   /* @PostMapping(value = "/fooditem/save")
    public String saveUser(@RequestBody FoodItem foodItem){
        foodItemRepo.save(foodItem);
        return "Saved...";
    }*/

    @GetMapping("/create")
    public String createFoodItem(Model model) {
        FoodItemDto foodItemDto = new FoodItemDto();
        model.addAttribute("foodItemDto", foodItemDto);
        //foodItemRepo.save(foodItem);
        return "fooditems/create";
    }

    @PostMapping("/create")
        public String createFoodIem(){
          return "redirect:/fooditems";
        }


   /* @PutMapping(value = "/fooditem/update/{id}")
    public String updateFoodItem(@PathVariable long id, @RequestBody FoodItem foodItem){
        FoodItem updateFoodItem = foodItemRepo.findById(id).get();
        updateFoodItem.setName(foodItem.getName());
        updateFoodItem.setDescription(foodItem.getDescription());
        updateFoodItem.setExpiryDate(foodItem.getExpiryDate());
        updateFoodItem.setQuantity(foodItem.getQuantity());
        foodItemRepo.save(updateFoodItem);

        return "Food item updated...";
    }*/

    @GetMapping("/edit")
    public String editFoodItem(Model model, @RequestParam Long id) {

        FoodItem foodItem = foodItemRepo.findById(id).orElse(null);
        if(foodItem == null) {
            return "redirect:/fooditems";
        }

        FoodItemDto foodItemDto = new FoodItemDto();
        foodItemDto.setName(foodItem.getName());
        foodItemDto.setDescription(foodItem.getDescription());
        foodItemDto.setExpiryDate(foodItem.getExpiryDate());
        foodItemDto.setQuantity(foodItem.getQuantity());

        model.addAttribute("foodItem", foodItem);
        model.addAttribute("foodItemDto", foodItemDto);

        return "fooditems/edit";
    }

    @DeleteMapping(value = "/fooditem/delete/{id}")
    public String deleteFoodItem(@PathVariable long id){
        FoodItem deleteFoodItem = foodItemRepo.findById(id).get();
        foodItemRepo.delete(deleteFoodItem);

        return "Deleted food item with the id: "+id;
    }



}
